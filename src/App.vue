<template>
    <div id="app">
        <SearchForm
            :query-fields-u-i="searchForm.queryFieldsUI"
            @submit="submitSearchForm"
        />
        <div v-cloak>
            <SearchEcho
                :display="searchEcho.display"
                :query-fields-u-i="searchForm.queryFieldsUI"
                @search-dci-dismiss="clickDismissSearchDCI"
            />
            <div class="container is-fluid">
                <div class="columns osq-panes">
                    <FacetPane
                        :display="facetPane.display"
                        :subjects-facet-list="facetPane.subjectsFacetList"
                        :subjects-facet-list-limit="facetPane.subjectsFacetListLimit"
                    />

                    <Spinner :display="spinner.display" />

                    <ResultsPane
                        :display="resultsPane.display"
                        :error="resultsPane.error"
                        :num-books="resultsPane.numBooks"
                        :num-pages="resultsPane.numPages"
                        :results="resultsPane.results"
                        @epub-click="setPreviewPane"
                    />
                    <PreviewPane
                        :display="previewPane.display"
                        :isbn="previewPane.isbn"
                        :title="previewPane.title"
                        @load-first-matched-page-link-click="previewFirstEpub"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FacetPane from './components/FacetPane';
import PreviewPane from './components/PreviewPane';
import ResultsPane from './components/ResultsPane';
import SearchEcho from './components/SearchEcho';
import SearchForm from './components/SearchForm';
import Spinner from './components/Spinner';

import { mapGetters, mapActions } from 'vuex';

const QUERY_FIELDS = [
    {
        dciLabel : 'full texts',
        label    : 'Full Text',
        name     : 'fulltext',
        value    : 'pageText',
    },
    {
        dciLabel : 'subjects',
        label    : 'Subjects',
        name     : 'subjects',
        value    : 'subjectNames',
    },
];

export default {
    name       : 'App',
    components : {
        FacetPane,
        PreviewPane,
        ResultsPane,
        SearchEcho,
        SearchForm,
        Spinner,
    },
    data() {
        return {
            disableWatch : {
                selectedSubjectFacetItems : false,
            },

            facetPane : {
                display              : false,
                subjectsFacetList      : [],
                subjectsFacetListLimit : 15,
            },
            previewPane : {
                display : false,
                isbn    : '',
                title   : '',
            },
            resultsPane : {
                display  : false,
                error    : false,
                numBooks : 0,
                numPages : 0,
                results  : [],
            },
            searchEcho : {
                display       : true,
                queryFieldsUI : QUERY_FIELDS,
            },
            searchForm : {
                queryUI       : '',
                queryFieldsUI : QUERY_FIELDS,
            },
            spinner : {
                display : false,
            },
        };
    },
    computed : {
        ...mapGetters(
            [
                'query',
                'queryFields',
                'selectedSubjectFacetItems',
            ]
        ),
    },
    watch : {
        selectedSubjectFacetItems() {
            if ( this.disableWatch.selectedSubjectFacetItems ) {
                // We allow only one-time disabling of this watch
                this.disableWatch.selectedSubjectFacetItems = false;

                return;
            }

            this.search();
        },
    },
    methods : {
        ...mapActions(
            [
                'clearSelectedSubjectFacetItems',
                'setQuery',
                'setQueryFields',
                'setSelectedSubjectFacetItems',
            ]
        ),
        clearPreviewPane() {
            this.setPreviewPane( '', '' );
        },
        clearResultsPane() {
            this.resultsPane.error    = false;
            this.resultsPane.numBooks = 0;
            this.resultsPane.numPages = 0;
            this.resultsPane.results  = [];
        },
        clickDismissSearchDCI() {
            this.search();
        },
        displayPanes( ...panes ) {
            this.setPanesDisplay( panes, true );
        },
        hidePanes( ...panes ) {
            this.setPanesDisplay( panes, false );
        },
        previewFirstEpub() {
            this.setPreviewPane(
                this.resultsPane.results[ 0 ].groupValue,
                this.resultsPane.results[ 0 ].doclist.docs[ 0 ].title,
            );
        },
        setFacetPaneFromSolrResponse( solrResponse ) {
            const subjectFacetItems = solrResponse.facet_counts.facet_fields.subjectNames_facet;

            if ( subjectFacetItems ) {
                this.facetPane.subjectsFacetList = [];
                for ( let i = 0; i < subjectFacetItems.length; i = i + 2 ) {
                    const subject = subjectFacetItems[ i ];
                    const numHits = subjectFacetItems[ i + 1 ];
                    this.facetPane.subjectsFacetList.push(
                        {
                            name    : subject,
                            numHits : numHits.toLocaleString(),
                        }
                    );
                }
            }

            // Remove subjects already selected by user
            this.selectedSubjectFacetItems.forEach(
                ( selectedSubject ) => {
                    const found = this.facetPane.subjectsFacetList.findIndex(
                        ( element ) => {
                            return element.name === selectedSubject;
                        }
                    );

                    if ( found !== -1 ) {
                        this.facetPane.subjectsFacetList.splice( found, 1 );
                    }
                }
            );
        },
        setPanesDisplay( panes, state ) {
            panes.forEach( ( pane ) => {
                pane.display = state;
            } );
        },
        setPreviewPane( isbn, title ) {
            this.previewPane.isbn = isbn;
            this.previewPane.title = title;
        },
        setResultsPaneFromSolrResponse( solrResponse ) {
            this.resultsPane.numBooks = solrResponse.response.numFound;
            this.resultsPane.results  = solrResponse.response.docs;
        },
        submitSearchForm() {
            // If we don't disable selectedSubjectFacetItems watch, clearSelectedSubjectFacetItems
            // will trigger another search.
            this.disableWatch.selectedSubjectFacetItems = true;
            this.clearSelectedSubjectFacetItems();
            this.search();
        },
        async search() {
            this.hidePanes(
                this.facetPane,
                this.resultsPane,
                this.previewPane,
            );

            this.clearPreviewPane();
            this.clearResultsPane();

            this.spinner.display = true;

            let response;
            try {
                response = await this.$solrSearch(
                    this.query,
                    this.queryFields,
                    this.selectedSubjectFacetItems
                );
            } catch( e ) {
                this.spinner.display = false;

                this.resultsPane.error = true;

                this.displayPanes( this.resultsPane );

                return;
            }

            this.setFacetPaneFromSolrResponse( response );
            this.setResultsPaneFromSolrResponse( response );

            this.spinner.display = false;

            if ( this.resultsPane.results.length > 0 ) {
                this.displayPanes(
                    this.facetPane,
                    this.resultsPane,
                    this.previewPane,
                );
            } else {
                this.displayPanes( this.resultsPane );
            }

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>

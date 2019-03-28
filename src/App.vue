<template>
    <div id="app">
        <SearchForm
            @submit="submitSearchForm"
        />
        <div v-cloak>
            <div class="osq-panes">
                <Spinner :display="spinner.display" />

                <ResultsPane
                    :display="resultsPane.display"
                    :error="resultsPane.error"
                    :highlights="resultsPane.highlights"
                    :max-description-length="resultsPane.maxDescriptionLength"
                    :num-books="resultsPane.numBooks"
                    :results="resultsPane.results"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ResultsPane from './components/ResultsPane';
import SearchForm from './components/SearchForm';
import Spinner from './components/Spinner';

import { mapGetters, mapActions } from 'vuex';

const QUERY_FIELDS = {
    author : {
        highlight : true,
        weight    : 4,
    },
    date : {
        highlight : true,
        weight    : 1,
    },
    description : {
        highlight : true,
        weight    : 2,
    },
    series_names  : {
        highlight : true,
        weight    : 3,
    },
    subtitle : {
        highlight : true,
        weight    : 4,
    },
    title : {
        highlight : true,
        weight    : 4,
    },
};

export default {
    name       : 'App',
    components : {
        ResultsPane,
        SearchForm,
        Spinner,
    },
    data() {
        return {
            resultsPane : {
                display              : false,
                error                : false,
                highlights           : {},
                maxDescriptionLength : this.$solrHighlightFragmentSize,
                numBooks             : 0,
                numPages             : 0,
                results              : [],
            },
            searchForm : {
                queryUI : '',
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
            ]
        ),
    },
    mounted : function () {
        this.setQueryFields( QUERY_FIELDS );
    },
    methods : {
        ...mapActions(
            [
                'setQuery',
                'setQueryFields',
            ]
        ),
        clearResultsPane() {
            this.resultsPane.error    = false;
            this.resultsPane.numBooks = 0;
            this.resultsPane.results  = [];
        },
        displayPanes( ...panes ) {
            this.setPanesDisplay( panes, true );
        },
        hidePanes( ...panes ) {
            this.setPanesDisplay( panes, false );
        },
        setPanesDisplay( panes, state ) {
            panes.forEach( ( pane ) => {
                pane.display = state;
            } );
        },
        setResultsPaneFromSolrResponse( solrResponse ) {
            this.resultsPane.highlights = solrResponse.highlighting;
            this.resultsPane.numBooks   = solrResponse.response.numFound;
            this.resultsPane.results    = solrResponse.response.docs;
        },
        submitSearchForm() {
            this.search();
        },
        async search() {
            this.hidePanes(
                this.resultsPane,
            );

            this.clearResultsPane();

            this.spinner.display = true;

            let response;
            try {
                response = await this.$solrSearch(
                    this.query,
                    this.queryFields,
                );
            } catch( e ) {
                this.spinner.display = false;

                this.resultsPane.error = true;

                this.displayPanes( this.resultsPane );

                return;
            }

            this.setResultsPaneFromSolrResponse( response );

            this.spinner.display = false;

            if ( this.resultsPane.results.length > 0 ) {
                this.displayPanes(
                    this.resultsPane,
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

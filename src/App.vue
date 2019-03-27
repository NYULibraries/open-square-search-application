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
                display  : false,
                error    : false,
                numBooks : 0,
                numPages : 0,
                results  : [],
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
            this.resultsPane.numBooks = solrResponse.response.numFound;
            this.resultsPane.results  = solrResponse.response.docs;
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

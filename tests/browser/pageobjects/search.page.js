/* global browser:false $:false $$:false */

import crypto from 'crypto';

import Page from './page';

import Footer from './classes/Footer';
import Navbar from './classes/Navbar';
import ResultsPane from './classes/ResultsPane';
import SearchForm from './classes/SearchForm';

class SearchPage extends Page {
    constructor() {
        super();

        this.footer           = new Footer();
        this.navbar           = new Navbar();
        this.resultsPane      = new ResultsPane();
        this.searchForm       = new SearchForm();
    }

    get alertText() {
        return browser.alertText;
    }

    get baseUrl() {
        return browser.options.baseUrl;
    }

    get googleAnalytics() {
        return $$( 'head script' ).map( ( scriptElement ) => {
            return scriptElement.getHTML();
        } );
    }

    get paths() {
        return {
            aboutOpenSquare : 'aboutopensquare/',
            accessibility   : 'https://www.nyu.edu/footer/accessibility.html',
            books           : 'books/',
            home            : '',
            search          : 'search/',
        };
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() {
        return browser.getTitle();
    };

    open( options ) {
        let url = this.paths.search;

        if ( browser.options.solrFake ) {
            url += `?solr=${ browser.options.solrFake.url }`;

            if ( options && options.solrErrorSimulation ) {
                url += '&solrErrorSimulation=' + options.solrErrorSimulation;
            }
        }

        super.open( url );
    }

    getSearchId( query ) {
        const hashQueryId = crypto.createHash( 'sha256' );

        return hashQueryId.update( query ).digest( 'hex' );
    }

    getSearchIdForCurrentSearch() {
        return this.getSearchId( this.searchForm.searchBox.getValue() );
    }

    search( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
    }

    searchAndWaitForResults( query ) {
        this.searchForm.searchBox.addValue( query );
        this.searchForm.submit();
        this.resultsPane.results._element.waitForVisible();
    }

    searchResultsSnapshot() {
        return {
            id              : this.getSearchIdForCurrentSearch(),

            query           : this.searchForm.searchBox.getValue(),

            resultsNumBooks : this.resultsPane.header.numBooks,
            resultsMetadata : this.resultsPane.results.metadata(),
        };
    }

    setViewportSize( size ) {
        // size must be an object with width and height fields:
        // {
        //     width  : 500,
        //     height : 500,
        // }
        browser.setViewportSize( size );
    }
}

export default new SearchPage();

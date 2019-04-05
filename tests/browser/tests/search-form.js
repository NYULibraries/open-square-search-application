/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Search form', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Spinner should appear when search is submitted', function () {
        // There don't seem to be any searches that are sufficiently slow to allow
        // the spinner to be displayed long enough for the SearchPage.spinner.isVisible()
        // to ever be true.  We intentionally do a search for which the Solr fake
        // has no stored result to send back.
        SearchPage.search( '[NO SOLR FAKE RESULTS FOR THIS SEARCH]' );

        assert( SearchPage.spinner.isVisible(), 'Spinner did not appear' );
    } );

    test(
        'Blank query should return zero results with suggestion to try another search',
        function () {
            const separator = ' ... ';

            SearchPage.search( '' );

            assert.equal(
                SearchPage.resultsPane.header.text +
                separator                      +
                SearchPage.resultsPane.results._element.getText(),
                'Results: None' + separator + 'Please try another search.'
            );
        }
    );
} );

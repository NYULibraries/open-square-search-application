/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Search form', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Spinner should appear when search is submitted', function () {
        SearchPage.search( '*' );

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

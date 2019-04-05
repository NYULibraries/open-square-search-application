/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Navbar', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Clicking "About Open Square" takes user to correct page', function () {
        SearchPage.navbar.aboutOpenSquare.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.aboutOpenSquare );
    } );

    test( 'Clicking "Browse Books" takes user to books page', function () {
        SearchPage.navbar.browse.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.books );
    } );

    test( 'Clicking "Open Square" logo takes user to home page', function () {
        SearchPage.navbar.home.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.home );
    } );

    test( 'Clicking "Search" takes user to search application', function () {
        SearchPage.navbar.search.click();

        assert.equal(
            SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.search
        );
    } );
} );

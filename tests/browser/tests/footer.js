/* global setup:false suite:false test:false */

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

suite( 'Footer', function () {
    setup( function () {
        SearchPage.open();
    } );

    test( 'Clicking "About Open Square" takes user to correct page', function () {
        SearchPage.footer.aboutOpenSquare.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.aboutOpenSquare );
    } );

    test( '"Accessibility" link has correct href', function () {
        const href = SearchPage.footer.accessibility.getAttribute( 'href' );

        assert.equal(  href, SearchPage.paths.accessibility );
    } );

    test( 'Clicking "Browse Books" takes user to books page', function () {
        SearchPage.footer.browse.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.books );
    } );

    test( 'Clicking "Open Square" logo takes user to home page', function () {
        SearchPage.footer.home.click();

        assert.equal(  SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.home );
    } );

    test( 'Clicking "Search" takes user to search application', function () {
        SearchPage.footer.search.click();

        assert.equal(
            SearchPage.currentUrl, SearchPage.baseUrl + SearchPage.paths.search
        );
    } );
} );

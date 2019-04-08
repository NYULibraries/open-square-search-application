/* global setup:false suiteSetup:false suite:false test:false */

import fs from 'fs';

import { assert } from 'chai';

import SearchPage from '../pageobjects/search.page';

import {
    clearActualFilesDirectory,
    clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    getActualFilePath,
    getGoldenFilePath,
    getGoldenFiles,
    jsonStableStringify,
    updateGoldenFiles,
    SUITE_NAME,
} from '../util';

const goldenFiles = getGoldenFiles( SUITE_NAME.searchResults );

suite( 'Search results', function () {
    suiteSetup( function () {
        clearActualFilesDirectory( SUITE_NAME.searchResults );
        clearDiffFilesDirectory( SUITE_NAME.searchResults );
    } );

    setup( function () {
        SearchPage.open();
    } );

    goldenFiles.forEach( ( goldenFile ) => {
        let golden = require( goldenFile );

        testSearchResults( golden );
    } );
} );

function testSearchResults( golden ) {
    const query          = golden.query;

    const testTitle = `Search for '${ query }' produces correct`              +
                      ' search results header and EPUBs list with thumbnails' +
                      ' and metadata';

    test( testTitle, function () {
        SearchPage.searchAndWaitForResults( query );

        const snapshot = SearchPage.searchResultsSnapshot();
        const searchId = SearchPage.getSearchIdForCurrentSearch();

        const stringifiedGolden = jsonStableStringify( golden );
        const stringifiedSnapshot = jsonStableStringify( snapshot );

        const actualFile = getActualFilePath( SUITE_NAME.searchResults, searchId );
        const goldenFile = getGoldenFilePath( SUITE_NAME.searchResults, searchId );

        if ( updateGoldenFiles() ) {
            fs.writeFileSync( goldenFile, stringifiedSnapshot );

            console.log( `Updated golden file ${ goldenFile }` );

            return;
        }

        fs.writeFileSync( actualFile, stringifiedSnapshot );

        const ok = ( stringifiedSnapshot === stringifiedGolden );
        let message;
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage( SUITE_NAME.searchResults, actualFile, goldenFile, searchId );
        }

        assert( ok, message );
    } );
}

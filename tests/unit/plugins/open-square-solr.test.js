import { createLocalVue } from '@vue/test-utils';
import merge from 'lodash.merge';

import OpenSquareSolr from '@/plugins/open-square-solr';
import { QUERY, QUERY_FIELDS } from '../test-utils';

// These are copied from plugin under test.
// Not DRY, but doesn't feel right to export them from the plugin just for the test.
const DEFAULT_HIGHLIGHT_FRAGMENT_SIZE = 500;
const ERROR_SIMULATION_SEARCH         = 'search';

function createLocalVueWithPlugin( pluginOverrides ) {
    const defaultOpenSquareSolrOptions = {
        solrCorePath : '/solr/open-square-metadata/',
        solrHost     : 'solr.dlib.nyu.edu',
        solrPort     : 8983,
        solrProtocol : 'http',
    };

    const localVue = createLocalVue();

    localVue.use( OpenSquareSolr, merge( defaultOpenSquareSolrOptions, pluginOverrides ) );

    return localVue;
}

describe( 'enm-solr plugin', () => {
    let localVue;

    beforeEach( () => {
        localVue = createLocalVueWithPlugin();
    } );

    test( '$solrHighlightFragment size is set to default if not passed in options', () => {
        expect( localVue.prototype.$solrHighlightFragmentSize ).toBe( DEFAULT_HIGHLIGHT_FRAGMENT_SIZE );
    } );

    test( '$solrHighlightFragment size is set by options.highlightFragmentSize', () => {
        const HIGHLIGHT_FRAGMENT_SIZE = 300;

        localVue = createLocalVueWithPlugin(
            {
                highlightFragmentSize : HIGHLIGHT_FRAGMENT_SIZE,
            },
        );

        expect( localVue.prototype.$solrHighlightFragmentSize ).toBe( HIGHLIGHT_FRAGMENT_SIZE );
    } );

    test( 'adds $solrSearch to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrSearch ).toBe( 'function' );
    } );

    test( '$solrSearch calls fetch with correct arguments', () => {
        const mockFetch = jest.fn().mockImplementation(
            () => Promise.resolve( { responseHeader : { status : 0 } } )
        );

        global.fetch = mockFetch;

        localVue.prototype.$solrSearch(
            QUERY,
            QUERY_FIELDS,
        );

        // Using hardcoded, un-DRY value because a DRY value would basically require
        // reproducing the very code being tested.
        expect( mockFetch ).toHaveBeenCalledWith(
            'http://solr.dlib.nyu.edu:8983/solr/open-square-metadata/select?q=something&fl=title,subtitle,description,author,date,identifier,coverHref,thumbHref&hl=true&hl.fl=queryField1,queryField4,queryField5,queryField6&hl.fragsize=500&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.snippets=1&qf=queryField1^4%20queryField2^1%20queryField3^2%20queryField4^3%20queryField5^4%20queryField6^4&rows=1999&sort=score%20desc,title_sort%20asc&defType=edismax&indent=on&wt=json'
        );

        delete global.fetch;
    } );

    test( `$solrSearch throws "${ ERROR_SIMULATION_SEARCH } when options.errorSimulation ` +
          `is set to "${ ERROR_SIMULATION_SEARCH }"`, async () => {
        localVue = createLocalVueWithPlugin(
            {
                errorSimulation : ERROR_SIMULATION_SEARCH,
            }
        );

        await expect(
            localVue.prototype.$solrSearch(
                QUERY,
                QUERY_FIELDS,
            )
        ).rejects.toThrow( ERROR_SIMULATION_SEARCH );
    } );
} );

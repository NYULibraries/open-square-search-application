import { createLocalVue } from '@vue/test-utils';
import merge from 'lodash.merge';

import OpenSquareSolr from '@/plugins/open-square-solr';

// Copied from plugin under test.
// Not DRY, but doesn't feel right to export them from the plugin just for the test.
const ERROR_SIMULATION_SEARCH       = 'search';

const QUERY = 'something';
const QUERY_FIELDS = {
    queryField1 : {
        highlight : true,
        weight    : 4,
    },
    queryField2 : {
        highlight : true,
        weight    : 1,
    },
    queryField3 : {
        highlight : true,
        weight    : 2,
    },
    queryField4  : {
        highlight : true,
        weight    : 3,
    },
    queryField5 : {
        highlight : true,
        weight    : 4,
    },
    queryField6 : {
        highlight : true,
        weight    : 4,
    },
};

describe( 'enm-solr plugin', () => {
    const OPEN_SQUARE_SOLR_OPTIONS = Object.freeze(
        {
            solrCorePath : '/solr/open-square-metadata/',
            solrHost     : 'solr.dlib.nyu.edu',
            solrPort     : 8983,
            solrProtocol : 'http',
        } );

    let localVue;
    let mockFetch;

    beforeAll( () => {
        mockFetch = jest.fn().mockImplementation(
            () => Promise.resolve( { responseHeader : { status : 0 } } )
        );

        global.fetch = mockFetch;
    } );

    beforeEach( () => {
        mockFetch.mockClear();

        localVue = createLocalVue();

        localVue.use( OpenSquareSolr, OPEN_SQUARE_SOLR_OPTIONS );
    } );

    test( 'adds $solrSearch to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrSearch ).toBe( 'function' );
    } );

    test( '$solrSearch calls fetch with correct arguments', () => {
        localVue.prototype.$solrSearch(
            QUERY,
            QUERY_FIELDS,
        );

        // Using hardcoded, un-DRY value because a DRY value would basically require
        // reproducing the very code being tested.
        expect( mockFetch ).toHaveBeenCalledWith(
            'http://solr.dlib.nyu.edu:8983/solr/open-square-metadata/select?q=something&fl=title,subtitle,description,author,date,identifier,coverHref,thumbHref&hl=true&hl.fl=queryField1,queryField2,queryField3,queryField4,queryField5,queryField6&hl.fragsize=500&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.snippets=1&qf=queryField1^4%20queryField2^1%20queryField3^2%20queryField4^3%20queryField5^4%20queryField6^4&rows=1999&sort=score%20desc,title_sort%20asc&defType=edismax&indent=on&wt=json'
        );
    } );

    test( `throws "${ ERROR_SIMULATION_SEARCH } when options.errorSimulation ` +
          `is set to "${ ERROR_SIMULATION_SEARCH }"`, async () => {
        const options = merge(
            {
                errorSimulation : ERROR_SIMULATION_SEARCH,
            },
            OPEN_SQUARE_SOLR_OPTIONS,
        );
        localVue = createLocalVue();
        localVue.use( OpenSquareSolr, options );

        await expect(
            localVue.prototype.$solrSearch(
                QUERY,
                QUERY_FIELDS,
            )
        ).rejects.toThrow( ERROR_SIMULATION_SEARCH );
    } );
} );

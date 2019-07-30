import ResultsPane from '@/components/ResultsPane';

import merge from 'lodash.merge';
import { shallowMount } from '@vue/test-utils';

function createWrapper( overrides ) {
    const defaultMountingOptions = {
        propsData : {
            display              : false,
            error                : false,
            highlights           : {},
            numBooks             : 0,
            results              : [],
        },
    };

    return shallowMount( ResultsPane, merge( defaultMountingOptions, overrides ) );
}

describe( 'ResultsPane', () => {
    const RESULTS =
        require( '../fixtures/solr-responses/solr-search.json' );

    let wrapper;

    function simulateError() {
        wrapper.setProps(
            {
                display : true,
                error   : true,
            }
        );
    }

    function simulateSearch() {
        wrapper.setProps(
            {
                display    : true,
                highlights : RESULTS.highlighting,
                numBooks   : RESULTS.length,
                results    : RESULTS.response.docs,
            }
        );
    }

    beforeEach( () => {
        wrapper = createWrapper();
    } );

    test( 'renders no results found correctly', () => {
        wrapper.setProps(
            {
                display  : true,
                numBooks : 0,
                results  : [],
            }
        );

        expect( wrapper.element ).toMatchSnapshot();
    } );

    test( 'renders results correctly', () => {
        simulateSearch();

        expect( wrapper.element ).toMatchSnapshot();
    } );

    test( 'renders error condition correctly', () => {
        simulateError();

        expect( wrapper.element ).toMatchSnapshot();
    } );
} );

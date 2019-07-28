import App from '@/App';
import ResultsPane from '@/components/ResultsPane';
import SearchForm from '@/components/SearchForm';
import Spinner from '@/components/Spinner';

import { shallowMount } from '@vue/test-utils';
import merge from 'lodash.merge';
import Vuex from 'vuex';
import { createLocalVueWithVuex } from '../test-utils';

const QUERY = 'something';
const QUERY_FIELDS = Object.freeze(
{
        queryField1 : {
            highlight : true,
            weight    : 4,
        },
        queryField2 : {
            highlight : false,
            weight    : 1,
        },
        queryField3 : {
            highlight : false,
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
    }
);

const MOCK_SOLR_SEARCH_RESPONSE = Object.freeze(
    require( '../fixtures/solr-responses/solr-search.json' )
);

function createWrapper( storeOverrides, mountingOverrides ) {
    const localVue = createLocalVueWithVuex();
    const defaultStoreOptions = {
        actions : {
            setQuery       : () => {},
            setQueryFields : () => {},
        },
        getters : {
            query       : () => '',
            queryFields : () => QUERY_FIELDS,
        },
    };

    const store = new Vuex.Store( merge( defaultStoreOptions, storeOverrides ) );

    const defaultMountingOptions = {
        localVue,
        store,
    };

    return shallowMount( App, merge( defaultMountingOptions, mountingOverrides ) );
}

describe( 'App', () => {
    test( 'sets visibility of panes correctly on initialization', () => {
        const wrapper = createWrapper();

        // Using .vm.display instead of .isVisible() because often the components
        // are not hiding the root element but instead are toggling the visibility
        // of child elements that contains the content.  This causes .isVisible()
        // to always return true for stubbed components.
        // Note that SearchForm is always visible and doesn't have a display prop.
        expect( wrapper.find( ResultsPane ).vm.display ).toBeFalsy();
        expect( wrapper.find( Spinner ).vm.display ).toBeFalsy();
    } );

    describe( 'when SearchForm emits submit event', () => {
        const mockSolrSearch = jest.fn().mockImplementation(
            ( query, queryFields, selectedSubjectFacetItems ) => {
                return MOCK_SOLR_SEARCH_RESPONSE;
            }
        );

        let wrapper;

        beforeEach( () => {
            mockSolrSearch.mockClear();

            const storeOverrides = {
                getters : {
                    query : () => QUERY,
                },
            };

            const mountingOverrides = {
                mocks : {
                    $solrSearch : mockSolrSearch,
                },
            };

            wrapper = createWrapper( storeOverrides, mountingOverrides );

            wrapper.find( SearchForm ).vm.$emit( 'submit' );
        } );

        test( 'sets visibility of panes correctly', () => {
            // Using .vm.display instead of .isVisible() because often the components
            // are not hiding the root element but instead are toggling the visibility
            // of child elements that contains the content.  This causes .isVisible()
            // to always return true for stubbed components.
            // Note that SearchForm is always visible and doesn't have a display prop.
            expect( wrapper.find( ResultsPane ).vm.display ).toBeTruthy();
        } );

        test( '$solrSearch is called with correct arguments', () => {
            expect( mockSolrSearch.mock.calls[ 0 ] ).toEqual(
                [
                    QUERY,
                    QUERY_FIELDS,
                ],
            );
        } );
    } );
} );

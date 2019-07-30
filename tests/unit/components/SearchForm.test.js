import SearchForm from '@/components/SearchForm';
import {
    createLocalVueWithVuex,
} from '../test-utils';

import mergeWith from 'lodash.mergeWith';
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const QUERY                 = 'something';
const SEARCH_INPUT_SELECTOR = '#osq-searchinput';

function createWrapper( storeOverrides, mountingOverrides ) {
    const localVue = createLocalVueWithVuex();
    const defaultStoreOptions = {
        actions : {
            setQuery : () => {},
        },
        getters : {
            query : () => QUERY,
        },
    };

    // Allow for empty objects and arrays in overrides to replace default values
    function customizer( objValue, srcValue ) {
        return srcValue || objValue;
    }

    const store = new Vuex.Store(
        mergeWith( defaultStoreOptions, storeOverrides, customizer )
    );

    const defaultMountingOptions = {
        localVue,
        store,
    };

    const mergedMountingOptions = mergeWith(
        defaultMountingOptions, mountingOverrides, customizer
    );

    return shallowMount( SearchForm, mergedMountingOptions );
}

describe( 'SearchForm', () => {
    test( 'renders correctly when initialized', () => {
        expect( createWrapper().element ).toMatchSnapshot();
    } );

    describe( 'when search is submitted', () => {
        const SUBMIT_EVENT = 'submit';

        const mockSetQuery = jest.fn();

        let wrapper;

        beforeEach( () => {
            mockSetQuery.mockRestore();

            const storeOverrides = {
                actions : {
                    setQuery : mockSetQuery,
                },
            };

            wrapper = createWrapper( storeOverrides );

            wrapper.find( SEARCH_INPUT_SELECTOR ).setValue( QUERY );

            wrapper.find( 'form' ).trigger( 'submit' );
        } );

        test( 'setQuery is called with correct arguments', () => {
            expect( mockSetQuery.mock.calls[ 0 ][ 1 ] ).toBe( QUERY );
        } );

        test( `"${ SUBMIT_EVENT }" is emitted`, () => {
            expect( wrapper.emitted() ).toHaveProperty( SUBMIT_EVENT );
        } );

        test( 'renders correctly', () => {
            expect( wrapper.element ).toMatchSnapshot();
        } );
    } );
} );

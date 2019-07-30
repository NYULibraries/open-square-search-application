import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import cloneDeep from 'lodash.clonedeep';
import storeConfig from '@/store/store-config';
import { QUERY } from "../test-utils";

describe( 'store-config', () => {
    const sampleSubjectFacetItems = [
        'subjectFacetItem1',
        'subjectFacetItem2',
        'subjectFacetItem3',
    ];

    const sampleQuery = 'query';

    let store;

    beforeEach( () => {
        const localVue = createLocalVue();
        localVue.use( Vuex );

        const clonedStoreConfig = cloneDeep( storeConfig );

        store = new Vuex.Store( clonedStoreConfig );
    } );

    describe( 'addSelectedSubjectFacetItem action', () => {
        test( 'adds subject facet item to selectedSubjectFacetItems', () => {
            const sampleSubjectFacetItem = sampleSubjectFacetItems[ 0 ];

            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItem );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( [ sampleSubjectFacetItem ] );
        } );
        test( 'does not add empty string to selectedSubjectFacetItems', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'addSelectedSubjectFacetItem', '' );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );
        } );
        test( 'does not add undefined to selectedSubjectFacetItems', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'addSelectedSubjectFacetItem', undefined );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );
        } );
        test( 'does not add null to selectedSubjectFacetItems', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'addSelectedSubjectFacetItem', null );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );
        } );
        test( 'does not add an array to selectedSubjectFacetItems', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );
        } );
        test( 'does not add an object to selectedSubjectFacetItems', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'addSelectedSubjectFacetItem', { something : 'something' } );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );
        } );
    } );

    describe( 'clearSelectedSubjectFacetItems action', () => {
        test( 'clears selectedSubjectFacetItems', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'clearSelectedSubjectFacetItems' );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( [] );
        } );
    } );

    describe( 'removeSelectedSubjectFacetItem action', () => {
        test( 'removes facet item from selectedSubjectFacetItem', () => {
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 0 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );
            store.dispatch( 'addSelectedSubjectFacetItem', sampleSubjectFacetItems[ 2 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual( sampleSubjectFacetItems );

            store.dispatch( 'removeSelectedSubjectFacetItem', sampleSubjectFacetItems[ 1 ] );

            expect( store.getters.selectedSubjectFacetItems ).toEqual(
                [
                    sampleSubjectFacetItems[ 0 ],
                    sampleSubjectFacetItems[ 2 ],
                ] );
        } );
    } );

    describe( 'setQuery action', () => {
        test( 'sets query', () => {
            store.dispatch( 'setQuery', sampleQuery );

            expect( store.getters.query ).toEqual( sampleQuery );
        } );
    } );

    describe( 'setQueryFields action', () => {
        const QUERY_FIELDS = Object.freeze(
            {
                queryField1 : {
                    highlight : true,
                    weight    : 1,
                },
                queryField2 : {
                    highlight : false,
                    weight    : 2,
                },
                queryField3 : {
                    highlight : true,
                    weight    : 3,
                },
            }
        );

        test( 'sets queryFields', () => {
            store.dispatch( 'setQueryFields', QUERY_FIELDS );

            expect( store.getters.queryFields ).toEqual( QUERY_FIELDS );
        } );

        test( 'if passed undefined, set to empty object', () => {
            store.dispatch( 'setQueryFields', QUERY_FIELDS );
            expect( store.getters.queryFields ).toEqual( QUERY_FIELDS );

            store.dispatch( 'setQueryFields', undefined );
            expect( store.getters.queryFields ).toEqual( {} );
        } );

        test( 'if passed null, set to empty object', () => {
            store.dispatch( 'setQueryFields', QUERY_FIELDS );
            expect( store.getters.queryFields ).toEqual( QUERY_FIELDS );

            store.dispatch( 'setQueryFields', null );
            expect( store.getters.queryFields ).toEqual( {} );
        } );

        test( 'if passed array, set to empty object', () => {
            store.dispatch( 'setQueryFields', QUERY_FIELDS );
            expect( store.getters.queryFields ).toEqual( QUERY_FIELDS );

            store.dispatch( 'setQueryFields', Object.keys( QUERY_FIELDS ) );
            expect( store.getters.queryFields ).toEqual( {} );
        } );

        test( 'if passed string, set to empty object', () => {
            store.dispatch( 'setQueryFields', QUERY_FIELDS );
            expect( store.getters.queryFields ).toEqual( QUERY_FIELDS );

            store.dispatch( 'setQueryFields', 'string' );
            expect( store.getters.queryFields ).toEqual( {} );
        } );
    } );
} );

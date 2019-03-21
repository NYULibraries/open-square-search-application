import Vue from 'vue';
import Vuex from 'vuex';

Vue.use( Vuex );

const store = new Vuex.Store( {
    strict : process.env.NODE_ENV !== 'production',

    state() {
        return {
            query                          : null,
            queryFields                    : [],
            selectedSubjectsFacetItems : [],
        };
    },
    getters : {
        query : state => state.query,

        queryFields : state => state.queryFields,

        selectedSubjectsFacetItems : state => state.selectedSubjectsFacetItems,
    },
    mutations : {
        addSelectedSubjectsFacetItem( state, subjectsFacetItem ) {
            state.selectedSubjectsFacetItems.push( subjectsFacetItem );
        },
        clearSelectedSubjectsFacetItems( state ) {
            state.selectedSubjectsFacetItems = [];
        },
        removeSelectedSubjectsFacetItem( state, subjectsFacetItem ) {
            const index = state.selectedSubjectsFacetItems.indexOf( subjectsFacetItem );
            if ( index > -1 ) {
                state.selectedSubjectsFacetItems.splice( index, 1 );
            }
        },
        setQuery( state, query ) {
            state.query = query;
        },
        setQueryFields( state, queryFields ) {
            state.queryFields = queryFields;
        },
    },
    actions : {
        addSelectedSubjectsFacetItem( { commit }, subjectsFacetItem ) {
            commit( 'addSelectedSubjectsFacetItem', subjectsFacetItem );
        },
        clearSelectedSubjectsFacetItems( { commit } ) {
            commit( 'clearSelectedSubjectsFacetItems' );
        },
        removeSelectedSubjectsFacetItem( { commit }, subjectsFacetItem ) {
            commit( 'removeSelectedSubjectsFacetItem', subjectsFacetItem );
        },
        setQuery( { commit }, query ) {
            commit( 'setQuery', query );
        },
        setQueryFields( { commit }, queryFields ) {
            commit( 'setQueryFields', queryFields );
        },
    },
} );

export default store;

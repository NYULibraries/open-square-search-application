export default {
    addSelectedSubjectFacetItem( { commit }, subjectFacetItem ) {
        commit( 'addSelectedSubjectFacetItem', subjectFacetItem );
    },
    clearSelectedSubjectFacetItems( { commit } ) {
        commit( 'clearSelectedSubjectFacetItems' );
    },
    removeSelectedSubjectFacetItem( { commit }, subjectFacetItem ) {
        commit( 'removeSelectedSubjectFacetItem', subjectFacetItem );
    },
    setQuery( { commit }, query ) {
        commit( 'setQuery', query );
    },
    setQueryFields( { commit }, queryFields ) {
        commit( 'setQueryFields', queryFields );
    },
};

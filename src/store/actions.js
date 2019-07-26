export default {
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
};

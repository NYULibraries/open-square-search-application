export default {
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
};

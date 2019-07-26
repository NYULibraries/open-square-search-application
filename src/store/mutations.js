export default {
    addSelectedSubjectFacetItem( state, subjectFacetItem ) {
        state.selectedSubjectFacetItems.push( subjectFacetItem );
    },
    clearSelectedSubjectFacetItems( state ) {
        state.selectedSubjectFacetItems = [];
    },
    removeSelectedSubjectFacetItem( state, subjectFacetItem ) {
        const index = state.selectedSubjectFacetItems.indexOf( subjectFacetItem );
        if ( index > -1 ) {
            state.selectedSubjectFacetItems.splice( index, 1 );
        }
    },
    setQuery( state, query ) {
        state.query = query;
    },
    setQueryFields( state, queryFields ) {
        state.queryFields = queryFields;
    },
};

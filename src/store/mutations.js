import isPlainObject from 'is-plain-object';

export default {
    addSelectedSubjectFacetItem( state, subjectFacetItem ) {
        if ( typeof subjectFacetItem === 'string' && subjectFacetItem !== '' ) {
            state.selectedSubjectFacetItems.push( subjectFacetItem );
        } else {
            console.error( `Invalid argument passed to addSelectedSubjectFacetItem: ` +
                           ( subjectFacetItem === '' ? '[empty string]' : subjectFacetItem )
            );
        }
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
        if ( isPlainObject( queryFields ) ) {
            state.queryFields = queryFields;
        } else {
            console.error( `Invalid argument passed to queryFields: ` + queryFields );
            state.queryFields = {};
        }
    },
};

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = function () {
    return {
        query                      : null,
        queryFields                : {},
        selectedSubjectFacetItems : [],
    };
};

export default {
    strict : process.env.NODE_ENV !== 'production',

    state,

    actions,
    getters,
    mutations,
};

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

function createLocalVueWithVuex() {
    const localVue = createLocalVue();

    localVue.use( Vuex );

    return localVue;
}

function createReadonlyStore( query, queryFields, selectedSubjectFieldFacetItems ) {
    const getters = {
        query                   : () => query,
        queryFields             : () => queryFields,
        selectedSubjectFacetItems : () => selectedSubjectFieldFacetItems,
    };

    return new Vuex.Store(
        {
            getters,
        }
    );
}

export {
    createLocalVueWithVuex,
    createReadonlyStore,
};

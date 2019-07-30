import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const QUERY = 'something';
const QUERY_FIELDS = Object.freeze(
    {
        queryField1 : {
            highlight : true,
            weight    : 4,
        },
        queryField2 : {
            highlight : false,
            weight    : 1,
        },
        queryField3 : {
            highlight : false,
            weight    : 2,
        },
        queryField4  : {
            highlight : true,
            weight    : 3,
        },
        queryField5 : {
            highlight : true,
            weight    : 4,
        },
        queryField6 : {
            highlight : true,
            weight    : 4,
        },
    }
);

function createLocalVueWithVuex() {
    const localVue = createLocalVue();

    localVue.use( Vuex );

    return localVue;
}

export {
    QUERY,
    QUERY_FIELDS,
    createLocalVueWithVuex,
};

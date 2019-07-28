import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

function createLocalVueWithVuex() {
    const localVue = createLocalVue();

    localVue.use( Vuex );

    return localVue;
}

export {
    createLocalVueWithVuex,
};

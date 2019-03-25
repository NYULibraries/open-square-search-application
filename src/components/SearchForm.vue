<template>
    <section class="hero is-primary osq-searchbox-hero">
        <div class="hero-body">
            <form
                class="osq-searchform"
                @submit.prevent="submitSearchForm"
            >
                <div class="osq-searchbox">
                    <input
                        id="osq-searchinput"
                        v-model="queryUI"
                        aria-label="Search for books"
                        type="text"
                        placeholder="Search for books"
                    >
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name  : 'SearchForm',
    data() {
        return {
            queryUI : '',
        };
    },
    computed : {
        ...mapGetters(
            [
                'query',
            ]
        ),
    },
    watch : {
        query( newValue, oldValue ) {
            // This watcher is for updating the form when another component
            // changes the query.  Note that this watcher forms a loop in the case of
            // the user submitting a new query via this component's own form,
            // since the submit form code changes the query.  It's a very fast
            // and finite loop however, and there may in fact come a time when in
            // the loop we would want to change the queryUI value -- for example,
            // for stopword removal or some other query rewrite that happens on
            // submission.
            // The loop could be broken by moving queryUI from data to props and
            // having App set it when another component changes the query, but
            // doing that doesn't seem worth the added complexity.
            this.queryUI = newValue;
        },
    },
    methods : {
        ...mapActions(
            [
                'setQuery',
            ]
        ),
        submitSearchForm() {
            this.setQuery( this.queryUI );

            this.$emit( 'submit' );
        },
    },
};
</script>

<style>
</style>

<template>
    <section class="hero is-primary osq-searchbox-hero">
        <div class="hero-body">
            <form
                class="osq-searchform"
                @submit.prevent="submitSearchForm"
            >
                <div class="osq-searchbox osq-search">
                    <input
                        id="osq-searchinput"
                        v-model="queryUI"
                        aria-label="Search for books"
                        type="text"
                        placeholder="Search for books"
                    >
                    <button
                        type="submit"
                        aria-label="submit"
                        value="submit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </button>
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

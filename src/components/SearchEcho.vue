<template>
    <section class="hero searchecho">
        <div class="container is-fluid">
            <div class="columns osq-searchecho">
                <div class="column">
                    <span
                        v-show="searchDCI && display"
                        class="tag"
                    >
                        {{ searchDCI }}
                        <button
                            id="search-dci"
                            class="delete is-small"
                            @click="clickDismissSearchDCI"
                        ></button>
                    </span>

                    <span
                        v-for="subjectDCI in subjectDCIs"
                        :key="subjectDCI.id"
                        class="tag"
                    >
                        Subject:&nbsp;<span class="osq-subject">
                            {{ subjectDCI.subject }}
                        </span>
                        <button
                            :id="subjectDCI.id"
                            class="delete is-small"
                            @click="clickDismissSubjectDCI"
                        ></button>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name  : 'SearchEcho',
    props : {
        display                      : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        queryFieldsUI : {
            type     : Array,
            required : true,
            default  : null,
        },
    },
    data() {
        return {
            queryFieldsByValueMap : {},
        };
    },
    computed : {
        ...mapGetters(
            [
                'query',
                'queryFields',
                'selectedSubjectFacetItems',
            ]
        ),
        searchDCI() {
            const that = this;

            if ( this.query && this.query !== '' ) {
                const selectedQueryFieldsDCILabels = this.queryFields.map(
                    function ( selectedQueryField ) {
                        return that.queryFieldsByValueMap[ selectedQueryField ].dciLabel;
                    }
                );

                return 'Searching ' +
                       selectedQueryFieldsDCILabels
                           .slice()
                           .sort().join( ' and ' ) + ' for: ' + this.query;
            } else {
                return null;
            }
        },
        subjectDCIs() {
            return this.selectedSubjectFacetItems.map( ( subject ) => {
                return {
                    id    : subject,
                    subject : subject,
                };
            } );
        },
    },
    created() {
        this.queryFieldsUI.forEach( queryField => {
            this.queryFieldsByValueMap[ queryField.value ] = queryField;
        } );
    },
    methods : {
        ...mapActions(
            [
                'removeSelectedSubjectFacetItem',
                'setQuery',
                'setQueryFields',
            ]
        ),
        clickDismissSearchDCI( event ) {
            // Change to blank search if no subject DCIs
            if ( this.selectedSubjectFacetItems.length === 0 ) {
                this.setQuery( '' );
            } else {
                // If subject DCIs and query is already "*", do nothing
                if ( this.query === '*' ) {
                    return;
                } else {
                    // If subject DCIs and query was not already "*", change to "*"
                    // and do a new search
                    this.setQuery( '*' );
                }
            }

            this.$emit( 'search-dci-dismiss', event.currentTarget.id );
        },
        clickDismissSubjectDCI( event ) {
            this.removeSelectedSubjectFacetItem( event.currentTarget.id );
        },
    },
};
</script>

<style>
</style>

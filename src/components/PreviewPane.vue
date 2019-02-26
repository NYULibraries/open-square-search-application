<template>
    <div
        v-show="display"
        class="column osq-pane osq-pane-preview"
    >
        <!--PREVIEW: NO EPUB SELECTED-->
        <div
            v-show="! isbn"
            id="message"
            class="message is-valign is-centered"
        >
            <p class="message-body has-text-centered">
                Choose a book at left to view matched pages, or
                                                             <br>
                                                             <a
                                                                 href="#"
                                                                 @click="loadFirstMatchedPage"
                                                             >
                                                                 Load the first matched page
                                                             </a>
            </p>
        </div>
        <!--PREVIEW: NO EPUB SELECTED-->

        <!--PREVIEW-->
        <div>
            <span
                v-if="isbn"
                id="preview-isbn"
                :name="isbn"
                style="display: none"
            ></span>

            <BarChart
                v-show="! errorPreviewEpub"
                :bar-chart-data="barChart.barChartData"
                :title="title"
                @bar-click="previewPage"
            />

            <h2
                v-show="errorPreviewEpub"
                id="preview-epub-error"
                class="is-size-4"
            >
                Sorry, this book cannot be previewed due to a server error.
                Please try your search again later.
            </h2>

            <div
                v-show="selectedPageNumber && ! errorPreviewEpub && ! errorPreviewPage"
                class="osq-subjectsonthispage"
            >
                <h3>Subjects on this page</h3>

                <ul>
                    <li
                        v-for="subjectOnPage in subjectsOnPage"
                        :key="subjectOnPage"
                    >
                        <!-- eslint-disable vue/no-v-html -->
                        <a
                            href="#"
                            v-html="subjectOnPage"
                        >
                        <!-- eslint-disable -->
                        </a>
                    </li>
                </ul>

                <div
                    v-if="subjectsOnPage === null || subjectsOnPage.length === 0"
                    class="osq-nosubjects"
                >
                    No subjects are associated with this page.
                </div>
            </div>

            <hr>

            <h2
                v-show="selectedPageNumber && errorPreviewPage"
                id="preview-epub-page-error"
                class="is-size-4"
            >
                Sorry, these pages cannot be previewed due to a server error.
                Please try your search again later.
            </h2>

            <!-- eslint-disable vue/no-v-html -->
            <div
                v-show="selectedPageNumber && ! errorPreviewEpub && ! errorPreviewPage"
                class="osq-pageText"
                v-html="pageText"
            >
            <!-- eslint-enable -->
            </div>
        </div>
    </div>
</template>

<script>
import BarChart from './BarChart';

import { mapGetters } from 'vuex';

const ALTERNATE_NAMES_LIST_SEPARATOR = '&nbsp;&bull;&nbsp;';
const HIGHLIGHT_PRE = '<mark>';
const HIGHLIGHT_POST = '</mark>';

export default {
    name       : 'PreviewPane',
    components : { BarChart },
    props      : {
        display       : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        isbn          : {
            type     : String,
            required : true,
            default  : null,
        },
        title         : {
            type     : String,
            required : true,
            default  : null,
        },
    },
    data() {
        return {
            barChart           : {
                barChartData : [],
                isbn         : this.isbn,
                title        : this.title,
            },
            errorPreviewEpub   : false,
            errorPreviewPage   : false,
            pageText           : null,
            selectedPageNumber : null,
            subjectsOnPage       : null,
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
    },
    watch : {
        isbn( newIsbn, oldIsbn ) {
            if ( newIsbn === '' ) {
                this.errorPreviewEpub = false;
                this.errorPreviewPage = false;

                this.barChart.barChartData = [];
                this.pageText = null;
                this.selectedPageNumber = null;
                this.subjectsOnPage = null;

                return;
            }

            this.previewEpub();
        },
    },
    methods : {
        loadFirstMatchedPage() {
            this.$emit( 'load-first-matched-page-link-click' );
        },
        async previewEpub() {
            let response;
            try {
                response = await this.solrPreviewEpub(
                    this.isbn,
                    this.query,
                    this.queryFields,
                    this.selectedSubjectFacetItems,
                );
            } catch( e ) {
                this.errorPreviewEpub = true;

                return;
            }

            const barChartData = [];

            // docs are sorted by pageSequenceNumber in asc order
            response.response.docs.forEach( ( doc ) => {
                barChartData.push(
                    {
                        page  : doc.pageNumberForDisplay,
                        score : doc.score,
                    }
                );
            } );

            this.barChart.barChartData = barChartData;
        },
        async previewPage( pageNumberForDisplay ) {
            this.selectedPageNumber = pageNumberForDisplay;

            let response;
            try {
                response = await this.solrPreviewPage(
                    this.isbn,
                    this.selectedPageNumber,
                    this.query,
                    this.queryFields
                );
            } catch( e ) {
                this.errorPreviewPage = true;

                return;
            }

            const doc = response.response.docs[ 0 ];
            const highlights = response.highlighting[
                Object.keys( response.highlighting )[ 0 ]
            ];

            let subjectHighlights, subjectsOnPage = [];
            let subjectNamesLists;

            if ( highlights.pageText ) {
                this.pageText = highlights.pageText[ 0 ];
            } else {
                this.pageText = doc.pageText;
            }

            if ( highlights.subjectNamesForDisplay ) {
                // Sample of prettified JSON string (without wrapping quotes):
                // [
                //     [
                //         "Conference on Critical Legal Studies"
                //     ],
                //     [
                //         "<mark>identity</mark> -- politics of",
                //         "<mark>Identity</mark> politics",
                //         "\"<mark>Identity</mark> politics\"",
                //         "Politics of <mark>identity</mark>"
                //     ],
                //     [
                //         "Ideology of the subject"
                //     ]
                // ]

                subjectHighlights = JSON.parse( highlights.subjectNamesForDisplay );
                subjectHighlights.forEach( ( subjectHighlightArray ) => {
                    const preferredName = subjectHighlightArray.shift();
                    const alternateNames = subjectHighlightArray;

                    if ( alternateNames.length === 0 ) {
                        // No alternate names
                        subjectsOnPage.push( preferredName );
                    } else {
                        if ( namesListContainsHighlights( alternateNames ) ) {
                            // Display alternate names - they contain highlights
                            subjectsOnPage.push(
                                preferredName +
                                ' <span class="osq-alt-names">(also: ' +
                                alternateNames.join( ALTERNATE_NAMES_LIST_SEPARATOR ) +
                                ')</span>'
                            );
                        } else {
                            // Do not display alternate names - they do not contain highlights
                            subjectsOnPage.push( preferredName );
                        }
                    }
                } );

                this.subjectsOnPage = subjectsOnPage;
            } else if ( doc.subjectNamesForDisplay ) {
                subjectNamesLists = JSON.parse( doc.subjectNamesForDisplay );
                this.subjectsOnPage = subjectNamesLists.map(
                    ( subjectNamesList ) => {
                        // The display/preferred name is the first element
                        return subjectNamesList.shift();
                    }
                );
            } else {
                this.subjectsOnPage = [];
            }
        },
        async solrPreviewEpub( isbn, query, queryFields, selectedSubjectFacetFields ) {
            const response = await this.$solrPreviewEpub(
                isbn,
                query,
                queryFields,
                selectedSubjectFacetFields,
            );

            return response;
        },
        async solrPreviewPage( isbn, pageNumberForDisplay, query, queryFields ) {
            const response = await this.$solrPreviewPage(
                isbn,
                pageNumberForDisplay,
                query,
                queryFields
            );

            return response;
        },
    },
};

function namesListContainsHighlights( alternateNames ) {
    return alternateNames.filter( ( alternateName ) => {
        return alternateName.indexOf( HIGHLIGHT_PRE ) !== -1 &&
               alternateName.indexOf( HIGHLIGHT_POST ) !== -1;
    } ).length > 0;
}
</script>

<style>
</style>

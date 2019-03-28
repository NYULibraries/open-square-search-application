<template>
    <div class="osq-results-hold">
        <!--RESULTS-->
        <template v-show="display">
            <!-- v-show is necessary on this <header> element for some reason.
                 Its visibility is not being toggled along with the other elements
                 in this <template>.
            -->
            <header v-show="display">
                <h2 class="osq-resultsheader">
                    {{ resultsHeader }}
                </h2>
            </header>
            <div
                v-show="display"
                class="osq-results"
            >
                <span v-if="( ! error ) && ( ! results || results.length === 0 )">
                    Please try another search.
                </span>

                <!--BOOK-->
                <div
                    v-for="result in results"
                    :id="result.identifier"
                    :key="result.identifier"
                    :name="result.title"
                >
                    <article class="book-summary">
                        <div
                            class="thumb"
                            role="presentation"
                        >
                            <a
                                :href="'/books/' + result.identifier + '/'"
                                tabindex="-1"
                                aria-hidden="true"
                            >
                                <img
                                    :src="`/open-square-reader/epub_content/${ result.identifier }/ops/images/${ result.identifier }-th.jpg`"
                                    alt=""
                                    class="img-fluid"
                                >
                            </a>
                        </div>
                        <div class="meta">
                            <div class="book-title-group">
                                <a
                                    :href="`/books/${ result.identifier }`"
                                >
                                    <div
                                        class="book-title"
                                        v-html="getFieldValueOrHighlightedFieldValue( result, 'title' )"
                                    >
                                    </div>
                                    <div
                                        class="book-subtitle"
                                        v-html="getFieldValueOrHighlightedFieldValue( result, 'subtitle' )"
                                    >
                                    </div>
                                </a>
                            </div>

                            <div
                                class="author"
                                v-html="getFieldValueOrHighlightedFieldValue( result, 'author' )"
                            >
                            </div>
                            <div class="pubdate">
                                <span>Published:</span> <span v-html="getFieldValueOrHighlightedFieldValue( result, 'date' )"></span>
                            </div>
                            <div
                                class="meta"
                                v-html="getFieldValueOrHighlightedFieldValue( result, 'description' )"
                            >
                            </div>
                        </div>
                    </article>
                </div>
                <!--BOOK-->
            </div>
        </template>
        <!--RESULTS-->
    </div>
</template>

<script>
export default {
    name   : 'ResultsPane',
    props  : {
        display  : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        error    : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        highlights   : {
            type     : Object,
            required : true,
            default  : function () {
                return null;
            },
        },
        numBooks : {
            type     : Number,
            required : true,
            default  : null,
        },
        results  : {
            type     : Array,
            required : true,
            default  : function () {
                return null;
            },
        },
    },
    data() {
        return {
            publicPath : process.env.BASE_URL,
        };
    },
    computed : {
        numBooksFormatted : function () {
            return this.numBooks ? this.numBooks.toLocaleString() : '';
        },
        resultsHeader : function () {
            if ( this.error ) {
                return 'Sorry, a server error has occurred.  Please try your search again later.';
            }

            if ( this.results && this.results.length > 0 ) {
                return 'Results: ' + this.numBooksFormatted + ' books';
            } else {
                return 'Results: None';
            }
        },
    },
    methods : {
        getFieldValueOrHighlightedFieldValue( result, field ) {
            const identifier = result.identifier;

            if ( this.highlights[ identifier ] && this.highlights[ identifier ][ field ] ) {
                // We only want the first snippet
                return this.highlights[ identifier ][ field ][ 0 ];
            } else {
                const fieldValue = result[ field ];

                if ( Array.isArray( fieldValue ) ) {
                    return fieldValue[ 0 ];
                } else {
                    return fieldValue;
                }
            }
        },
    },
};
</script>

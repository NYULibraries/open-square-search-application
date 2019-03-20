<template>
    <div class="column enm-pane enm-pane-results is-half">
        <!--RESULTS-->
        <template v-show="display">
            <!-- v-show is necessary on this <header> element for some reason.
                 Its visibility is not being toggled along with the other elements
                 in this <template>.
            -->
            <header v-show="display">
                <h2 class="is-size-4">
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
                    class="box"
                >
                    <article class="media osq-book">
                        <div class="media-left">
                            <figure class="image osq-thumbnail">
                                <img
                                    :src="'/enm/search/assets/covers/' + result.groupValue + '.jpg'"
                                    alt=""
                                >
                            </figure>
                        </div>
                        <div class="media-content">
                            <!-- The link to load the preview is repeated.
                                 Tte first one is for fancy "whole div" rollovers
                                 and the second is for accessibility.
                                 TODO: Check with Laura to see if the above still holds. -->
                            <a
                                class="osq-divlink"
                                href="#"
                            >
&nbsp;
                            </a>
                            <h3 class="title is-spaced">
                                <a href="#">
                                    {{ result.title }}
                                </a>
                            </h3>
                            <div class="meta">
                                {{ result.author[ 0 ] }}; {{ result.date }}
                            </div>
                            <div class="meta">
                                {{ result.description }}
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
    name  : 'ResultsPane',
    props : {
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
};
</script>

<style>
    .book-cover-thumbnail {
        max-height: 64px;
        width: auto !important;
    }

    .osq-page-active {
        fill: lightgrey;
        stroke: black;
    }
</style>

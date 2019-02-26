<template>
    <div class="column osq-pane osq-pane-facets is-2">
        <div
            v-show="display"
            class="content"
        >
            <h2 class="osq-pane-heading is-size-5">
                Limit by Subject
            </h2>

            <div class="osq-facets-list">
                <div class="osq-subjects osq-facets-group-visible">
                    <a
                        v-for="subject in subjectFacetItemsAlwaysVisible"
                        :id="subject.name"
                        :key="subject.name"
                        href="#"
                        @click="clickSubjectFacetItem"
                    >
                        {{ subject.name }}
                        <span class="osq-hitcount">
                            ({{ subject.numHits }})
                        </span>
                    </a>
                </div>

                <a
                    v-show="( ! showAllSubjects ) && ( subjectsFacetList.length > subjectsFacetListLimit )"
                    class="listui seemore"
                    href="#"
                    @click="showAllSubjects = ! showAllSubjects"
                >
                    <i
                        class="fa fa-angle-double-down"
                        aria-hidden="true"
                    ></i>See All
                </a>

                <div
                    v-show="( showAllSubjects ) && ( subjectsFacetList.length > subjectsFacetListLimit )"
                    class="osq-subjects osq-facets-group-togglable"
                >
                    <a
                        v-for="subject in subjectFacetItemsToggleable"
                        :id="subject.name"
                        :key="subject.name"
                        href="#"
                        @click="clickSubjectFacetItem"
                    >
                        {{ subject.name }}
                        <span class="osq-hitcount">
                            ({{ subject.numHits }})
                        </span>
                    </a>
                </div>

                <a
                    v-show="( showAllSubjects ) && ( subjectsFacetList.length > subjectsFacetListLimit )"
                    class="listui seemore"
                    href="#"
                    @click="showAllSubjects = ! showAllSubjects"
                >
                    <i
                        class="fa fa-angle-double-up"
                        aria-hidden="true"
                    ></i>See Less
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const DEFAULT_TOPIC_FACET_LIST_LIMIT = 15;

export default {
    name  : 'FacetPane',
    props : {
        display              : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        subjectsFacetList      : {
            type     : Array,
            required : true,
            default  : function () {
                return null;
            },
        },
        subjectsFacetListLimit : {
            type     : Number,
            required : true,
            default  : function () {
                return DEFAULT_TOPIC_FACET_LIST_LIMIT;
            },
        },
    },
    data() {
        return {
            showAllSubjects : false,
        };
    },
    computed : {
        subjectFacetItemsAlwaysVisible() {
            return this.subjectsFacetList.slice( 0, this.subjectsFacetListLimit );
        },
        subjectFacetItemsToggleable() {
            if ( this.showAllSubjects ) {
                return this.subjectsFacetList.slice( this.subjectsFacetListLimit );
            } else {
                return [];
            }
        },
    },
    watch : {
        subjectsFacetList( newList, oldList ) {
            this.showAllSubjects = false;
        },
    },
    methods : {
        ...mapActions(
            [
                'addSelectedSubjectFacetItem',
            ]
        ),
        clickSubjectFacetItem( event ) {
            this.addSelectedSubjectFacetItem( event.currentTarget.id );
        },
    },
};
</script>

<style>
</style>

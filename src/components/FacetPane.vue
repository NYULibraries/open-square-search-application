<template>
    <div class="column osq-pane osq-pane-facets is-2">
        <div
            v-show="display"
            class="content"
        >
            <h2 class="osq-pane-heading is-size-5">
                Limit by Topic
            </h2>

            <div class="osq-facets-list">
                <div class="osq-topics osq-facets-group-visible">
                    <a
                        v-for="topic in topicFacetItemsAlwaysVisible"
                        :id="topic.name"
                        :key="topic.name"
                        href="#"
                        @click="clickTopicFacetItem"
                    >
                        {{ topic.name }}
                        <span class="osq-hitcount">
                            ({{ topic.numHits }})
                        </span>
                    </a>
                </div>

                <a
                    v-show="( ! showAllTopics ) && ( topicsFacetList.length > topicsFacetListLimit )"
                    class="listui seemore"
                    href="#"
                    @click="showAllTopics = ! showAllTopics"
                >
                    <i
                        class="fa fa-angle-double-down"
                        aria-hidden="true"
                    ></i>See All
                </a>

                <div
                    v-show="( showAllTopics ) && ( topicsFacetList.length > topicsFacetListLimit )"
                    class="osq-topics osq-facets-group-togglable"
                >
                    <a
                        v-for="topic in topicFacetItemsToggleable"
                        :id="topic.name"
                        :key="topic.name"
                        href="#"
                        @click="clickTopicFacetItem"
                    >
                        {{ topic.name }}
                        <span class="osq-hitcount">
                            ({{ topic.numHits }})
                        </span>
                    </a>
                </div>

                <a
                    v-show="( showAllTopics ) && ( topicsFacetList.length > topicsFacetListLimit )"
                    class="listui seemore"
                    href="#"
                    @click="showAllTopics = ! showAllTopics"
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
        topicsFacetList      : {
            type     : Array,
            required : true,
            default  : function () {
                return null;
            },
        },
        topicsFacetListLimit : {
            type     : Number,
            required : true,
            default  : function () {
                return DEFAULT_TOPIC_FACET_LIST_LIMIT;
            },
        },
    },
    data() {
        return {
            showAllTopics : false,
        };
    },
    computed : {
        topicFacetItemsAlwaysVisible() {
            return this.topicsFacetList.slice( 0, this.topicsFacetListLimit );
        },
        topicFacetItemsToggleable() {
            if ( this.showAllTopics ) {
                return this.topicsFacetList.slice( this.topicsFacetListLimit );
            } else {
                return [];
            }
        },
    },
    watch : {
        topicsFacetList( newList, oldList ) {
            this.showAllTopics = false;
        },
    },
    methods : {
        ...mapActions(
            [
                'addSelectedTopicFacetItem',
            ]
        ),
        clickTopicFacetItem( event ) {
            this.addSelectedTopicFacetItem( event.currentTarget.id );
        },
    },
};
</script>

<style>
</style>

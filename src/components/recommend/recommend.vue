<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content" :data="discList">
            <div>
                <div class="slider-wrapper">
                    <div v-show="recommends.length" class="slider-content">
                        <slider>
                            <swiper-slide :key="item.linkUrl" v-for="item in recommends">
                                <a :href="item.linkUrl">
                                    <img @load="loadImages" width="100%" height="100%" :src="item.picUrl">
                                </a>
                            </swiper-slide>
                        </slider>
                    </div>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li @click="selectItem(item)" v-for="item in discList" class="item" :key="item.imgurl">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl" alt="">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {getRecommend, getDiscList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import slider from 'base/slider/slider'
    import scroll from 'base/scroll/scroll'
    import loading from 'base/loading/loading'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playlistMixin],
        name: 'recommend',
        components: {
            swiper,
            swiperSlide,
            slider,
            scroll,
            loading
        },
        data() {
            return {
                recommends: [],
                discList: []
            }
        },
        created() {
            this._getRecommend();
            this._getDiscList()
        },
        methods: {
            handlePlaylist(playList) {
                const bottom = playList.length > 0 ? '60px' : '';
                this.$refs.recommend.style.bottom = bottom;
                this.$refs.scroll.refresh()
            },
            _getRecommend() {
                getRecommend().then((res) => {
                    if (res.code === ERR_OK) {
                        this.recommends = res.data.slider
//                      console.log(this.recommends)
                    }
                })
            },
            _getDiscList() {
                getDiscList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.discList = res.data.list;
                        console.log(this.discList)
                    }
                })
            },
            loadImages() {
                if (!this.checkLoaded) {
                    this.$refs.scroll.refresh();
                    this.checkLoaded = true
                }
            },
            selectItem(item) {
                this.$router.push({
                    path: `/recommend/${item.dissid}`
                });
                this.setDisc(item)
            },
            ...mapMutations({
                'setDisc': 'SET_DISC'
            })
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/variable"
    .recommend
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .recommend-content
            height: 100%
            overflow: hidden
            .slider-wrapper
                position: relative
                width: 100%
                height: 0
                padding-top 40%
                overflow: hidden
                .slider-content
                    position absolute
                    top 0
                    left 0
                    width 100%
                    height 100%
            .recommend-list
                .list-title
                    height: 65px
                    line-height: 65px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-theme
                .item
                    display: flex
                    box-sizing: border-box
                    align-items: center
                    padding: 0 20px 20px 20px
                    .icon
                        flex: 0 0 60px
                        width: 60px
                        padding-right: 20px
                    .text
                        display: flex
                        flex-direction: column
                        justify-content: center
                        flex: 1
                        line-height: 20px
                        overflow: hidden
                        font-size: $font-size-medium
                        .name
                            margin-bottom: 10px
                            color: $color-text
                        .desc
                            color: $color-text-d
            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
</style>

<style>
    .swiper-pagination .swiper-pagination-bullet-active {
        opacity: 1;
        background: rgba(255, 255, 255, 0.8);
        width: 20px;
        border-radius: 5px;
        transition: all 0.5s linear;
    }
</style>

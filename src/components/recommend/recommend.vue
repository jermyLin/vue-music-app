<template>
  <div class="recommend" ref="recommend">
    <div class="recommend-content">
      <div>
        <div class="slide">
          <swiper class="swiper-wrapper" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
            <swiper-slide class="swiper-item" :key="item.linkUrl" v-for="item in recommends">
              <a :href="item.linkUrl">
                <img width="100%" height="100%" :src="item.picUrl">
              </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config'

  export default {
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        recommends: [],
        notNextTick: true,
        swiperOption: {
          initialSlide: 1,
          autoplay: 2000,
          autoplayDisableOnInteraction: false,
          direction: 'horizontal',
          speed: 1000,
          loop: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          slidesPerView: 1,
          mousewheelControl: true
        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    mounted() {
      // you can use current swiper instance object to do something(swiper methods)
      // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
      console.log('this is current swiper instance object', this.swiper)
    },
    created() {
      this._getRecommend()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            console.log(this.recommends)
          }
        })
      },
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
        .slide
          position: relative
          width: 100%
          height: 0
          padding-top 40%
          overflow: hidden
          .swiper-wrapper
            position absolute
            top 0
            left 0
            .pagination
              position: absolute;
              text-align: center;
              transition: 300ms;
              transform: translate3d(0, 0, 0);
              z-index: 10;
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
    background: #fff;
    width: 20px;
    border-radius: 5px;
    transition: all 0.5s linear;
  }
</style>

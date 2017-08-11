<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      console.log(this.singer)
      this._getDetail(this.singer.id)
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
      //...mapGetters语法糖等价于下面singer方法
//      singer() {
//       return this.$store.getters.singer
//      }
    },
    methods: {
      _getDetail(id) {
        if (!id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalzieSong(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalzieSong(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if(musicData.albummid && musicData.songid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  };
</script>

<style lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background $color-background

  .slide-enter-active, .slide-leave-active
    transition all 0.3s linear

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>

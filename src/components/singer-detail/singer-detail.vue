<template>
  <transition name="slide">
    <music-list
      :songs="songs"
      :title="title"
      :bgImage="bgImage"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import musicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      musicList
    },
    created() {
      console.log(this.singer);
      this._getDetail(this.singer.id)
    },
    computed: {
      bgImage() {
        return this.singer.avatar
      },
      title() {
        return this.singer.name
      },
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
          this.$router.push('/singer');
          return
        }
        getSingerDetail(id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalzieSong(res.data.list);
            console.log(this.songs)
          }
        })
      },
      _normalzieSong(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.albummid && musicData.songid) {
            ret.push(createSong(musicData))
          }
        });
        return ret
      }
    }
  };
</script>

<style lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition all 0.3s linear

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>

<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import listView from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门'
  const HOT_LIST_LEN = 10
  export default {
    data() {
      return {
        singerList: []
      }
    },
    components: {
      listView
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {//点击选择歌手详情
        this.$router.push(
          {path: `/singer/${singer.id}`}
        )
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalizeSinger(res.data.list)
          }
          console.log(res.data.list)
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_LIST_LEN) {//热门人数选10个
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        })
        console.log(map)
        //为了得到有序列表。把对象map转换成数组
        let hot = [];
        let ret = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        //charCodeAt() 来获得字符串中某个具体字符的 Unicode 编码。
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER' // 映射 this.setSinger() 为 this.$store.commit('SET_SINGER')
      })
    }
  }
</script>

<style lang="stylus" ref="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>

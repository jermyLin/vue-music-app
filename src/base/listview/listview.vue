<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.name">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :key="item"
            class="item"
            :data-index="index"
            :class="{current:currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base/loading/loading'

  const TITLE_HEIGHT = 30;
  const ANCHOR_HEIGHT = 18;
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      scroll,
      loading
    },
    data() {
      return {
        pos_y: '',//用来判断是否为滚动到最顶部，滚动到最顶部为正值，反正负值
        scrollY: 0,//歌手列表滚动的距离
        listHeight: [],//歌手列表的高度区间
        diff: -1//用来监听固定标题栏是否重合，譬如A的标题被下个区间的B标题顶到，当值小于30且大于0的时候，标题栏开始重合
      }
    },
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.probeType = 3;
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      },
      currentIndex() {//计算滚动高度落在滚动区间的索引值
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            this.diff = height2 + this.pos_y;
            return i;
          }
        }
        return 0;
      },
      fixedTitle() {
        if (this.pos_y >= 0) {
          return;
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      },
    },
    methods: {
      onShortCutTouchStart(e) {//右侧字母栏点击事件
        let anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex)
      },
      onShortCutTouchMove(e) {//右侧字母栏触摸滑动事件
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        //计算触摸滑动的偏移量除以每个字母的高度。获取滚动了几个字母元素
        let dalta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
        //计算滚动在第几个元素上的索引值
        let anchorIndex = parseInt(this.touch.anchorIndex) + dalta;
        console.log(anchorIndex);
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {//better-scroll监听的页面滚动事件
        this.pos_y = pos.y;
        this.scrollY = Math.abs(Math.round(this.pos_y));
//        console.log(this.pos_y)
      },
      selectItem(item) {//点击选择歌手详情
        this.$emit('select', item)
      },
      _scrollTo(index) {
        console.log(index);
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = this.listHeight[index];

        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {//计算左侧歌手列表的高度区间
        let groupList = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < groupList.length; i++) {
          height += groupList[i].clientHeight;
          this.listHeight.push(height)
        }
        console.log(this.listHeight)
      },
    }
  };
</script>

<style lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

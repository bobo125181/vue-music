<template>
  <scroll class="listview" :data="data" ref="listview" :listen-scroll="listenScroll" @scroll="scroll" :probe-type="probeType">
    <ul>
      <li v-for="(group, key) in data" class="list-group" :key="key" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
              <li class="list-group-item" v-for="(item, key) in group.items" :key="key" @click="selectItem(item)">
                  <img v-lazy="item.avatar" class="avatar">
                  <span class="name">{{item.name}}</span>
              </li>
          </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
            <li class="item" v-for="(item, key) in showCutList" :key="key" :data-index="key" :class="{'current': currentIndex === key}">{{item}}</li>
        </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom.js'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 28
export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      probeType: 3,
      diff: -1
    }
  },
  computed: {
    // 因为数据处理之后是热门，进行字符串截取
    showCutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    // 开始触摸
    onShortcutTouchStart (e) {
      // 获取自定义属性的值和得到开始触摸的点
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      // 获取点击的下标并赋值
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // 移动事件
    onShortcutTouchMove (e) {
      // 得到移动的点
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 用移动的点减去一开始点击的点获取移动了几个坐标
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 得到移动的下标
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 滚动事件
    _scrollTo (index) {
      this.scrollY = -this.listHeight[index]
      // 左联动
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
    },
    diff (newY) {
      let fixedTop = (newY >= 0 && newY < TITLE_HEIGHT) ? newY - TITLE_HEIGHT : 0
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"

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
        margin-top:-2px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
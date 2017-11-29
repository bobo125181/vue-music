<template>
  <div class="singer">
      singer
  </div>
</template>
<script>
import fetcher from 'common/js/fetcher'
export default {
  data () {
    return {}
  },
  mounted () {
    this.getSinger()
  },
  methods: {
    getSinger () {
      console.log(fetcher.jsonp)
      // fetcher.jsonp('https://api.douban.com/v2/movie/in_theaters').then((res) => {
      //   return res.json()
      // }).then((json) => {
      //   console.log(json)
      // })
      fetcher.get('https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0', {}).then((res) => {
        console.log(res)
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
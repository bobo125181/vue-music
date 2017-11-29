/*
id:歌曲的唯一标识
mid：歌手的图片
singer：歌手的信息
name：歌曲的名称
album：专辑的名称
duration：歌曲的播放时长
image：歌曲的图片
url：歌曲的原播放地址
*/
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    } else {
      return new Promise((resolve, reject) => {
        getLyric(this.mid).then((res) => {
          if (res.retcode === ERR_OK) {
            this.lyric = Base64.decode(res.lyric)
            resolve(this.lyric)
          } else {
            reject('no lyric')
          }
        })
      })
    }
  }
}
export function createSong (item) {
  return new Song({
    id: item.songid,
    mid: item.songmid,
    singer: filterSinger(item.singer),
    name: item.songname,
    album: item.albumname,
    duration: item.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${item.songid}.m4a?fromtag=46`
  })
}
function filterSinger (singer) {
  let ret = []
  singer.forEach((val) => {
    if (!val) {
      return ''
    } else {
      ret.push(val.name)
    }
  })
  return ret.join('/')
}
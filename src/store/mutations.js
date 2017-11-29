import * as types from './mutation-types.js'
const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_START] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYINGLIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX] (state, index) {
    state.currentIndex = index
  }
}
export default mutations
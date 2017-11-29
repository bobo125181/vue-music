import 'whatwg-fetch'
import fetchJsonp from 'fetch-jsonp'
const reqHeaders = {
  Accept: 'application/json',
  'Access-Control-Allow-Origin': '*'
  // 'Cache-Control': 'no-cache',
  // sysCode: 'market',
  // 'market-token': localStorage.market_TOKEN || ''
}
function coverQuery (params) {
  return Object.keys(params).reduce((pre, key) => {
    return (pre + `${(key)}=${params[key]}&`)
  }, '').slice(0, -1)
}
function param (data) {
  let url = ''
  for (let k in data) {
    let val = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(val)
  }
  return url ? url.substring(1) : ''
}
const request = (url, init) => new Promise((resolve, reject) => {
  fetch(url, init).then((res) => {
    if (res.ok) {
      resolve(res.json())
    } else {
      reject(res)
    }
  })
})
export default {
  get: (url, params) => {
    return request(url + '?' + coverQuery(params), {
      method: 'GET',
      headers: reqHeaders,
      mode: 'no-cors'
    })
  },
  post: (url, params) => {
    return request(url, {
      method: 'POST',
      headers: Object.assign({}, reqHeaders, {
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: coverQuery(params)
    })
  },
  jsonp: (url, params) => {
    if (params) {
      url += (url.indexOf('?') < 0 ? '?' : '&') + param(params)
    } else {
      url = String(url)
    }
    return fetchJsonp(url)
  }
}

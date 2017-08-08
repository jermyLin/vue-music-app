import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + objSerialize(data)
  return new Promise(function (resolve, reject) {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// json参数序列化
function objSerialize(obj) {
  return Object.keys(obj).map(function (k) {
    obj[k] = obj[k] === undefined ? '' : obj[k]
    return `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
  }).join('&')
}
// import originJsonp from 'jsonp'
//
// export default function jsonp(url, data, option) {
//   url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
//
//   return new Promise((resolve, reject) => {
//     originJsonp(url, option, (err, data) => {
//       if (!err) {
//         resolve(data)
//       } else {
//         reject(err)
//       }
//     })
//   })
// }
//
// export function param(data) {
//   let url = ''
//   for (var k in data) {
//     let value = data[k] !== undefined ? data[k] : ''
//     url += '&' + k + '=' + encodeURIComponent(value)
//   }
//   return url ? url.substring(1) : ''
// }

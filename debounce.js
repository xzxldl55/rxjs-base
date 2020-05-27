function debounce (callback, waitTime, ctx = this) {
  var timeout = null,
      callbackargs = null,
      later = function () { callback.apply(ctx, callbackargs) }

  return function () {
    callbackargs = arguments
    clearTimeout(timeout)
    timeout = setTimeout(later, waitTime)
  }
}

var handler = debounce(function () {
  console.log('debounce')
}, 3000)

handler()
setTimeout(function () {
  handler()
}, 2000)
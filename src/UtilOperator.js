const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

/**
 * 实用工具操作符 --> 我们都是工具人🔧👨
 */

// 1.delay：即延迟开始吐出数据的事件，可以接受integer(ms)也可以接收一个Data对象(如在某个时间点，让程序干什么。。。)
/**
 * O1: ---0---1---2---3...
 * O2: -----|
 * Delay: --------0---1---2...
 *
 * 多用于对UI的控制
 */
let oaDelay = Observable.interval(300).delay(new Date((new Date()).getTime() + 500)) // 在当前时间500ms后 --> 所以在800ms后吐出第一个数据
// oaDelay.subscribe(console.log)

// 2.delayWhen：作用与delay相似，差别在于delayWhen能够影响每个元素，且需要传入一个callback并在callback内返回一个Observable 🌟
/**
 * 这里单独控制每一个元素的延迟时间
 */
let oaDelayWhen = Observable.interval(200).take(5).delayWhen(x => Observable.empty().delay(200 * x * x))
// oaDelayWhen.subscribe(console.log)




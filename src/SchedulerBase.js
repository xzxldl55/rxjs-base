const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

/**
 * 引言：Observable的优势之一是能够同时处理同步与非同步的行为。但此时也带来了一个问题：我们常常会不知道某个Observable到底是同步还是异步的行为。
 *      换句话说，我们很容易搞不清楚这个Observable到底什么时候开始发送元素。
 * 背景：而Scheduler便是拿来处理这个问题的。Scheduler能够控制一个observable的订阅什么时候开始，以及发送元素什么时候送达，Scheduler主要有以下三点组成：
 * . Scheduler是一个数据结构。他知道如何根据优先级或者其他标准来存储并队列任务。
 * . Scheduler是一个执行环境。它能够了解并规定任务何时何地运行，如立即执行，在callback中执行，setTimeout中执行，animation frame（requestAnimationFrame）中执行。
 * . Scheduler是一个虚拟的⏲️，它通过now()方法提供时间概念，我们能够让任务在特定的时间点被执行。
 * 简言之，Scheduler能够影响Observable开始执行以及送达元素的时机
 */
// Simple Example:
let oaCreate = Observable.create(function (observer) {
  observer.next(1)
  observer.next(2)
  observer.next(3)
  observer.complete()
})
// console.log('Before Subscribe!')
// oaCreate.observeOn(Rx.Scheduler.async) // 将Observable变成了异步执行的！
//   .subscribe({
//     next: v => console.log(v),
//     error: err => console.log(err),
//     complete: () => console.log('complete!')
//   })
// console.log('After Subscribe!')

/**
 * ✨：其实在使用各种operator时，这些operator就会各自预设不同的scheduler，例如一个无限的observable会预设为queue scheduler，而timer相关的
 *     则会预设为async scheduler。
 *     而要使用Scheduler除了前面用到的observeOn()方法外，以下这几个creation operators的最后一个参数都能够接收scheduler：
 *        bindCallback
 *        bindNodeCallback
 *        combineLatest
 *        concat
 *        empty
 *        from
 *        fromPromise
 *        interval
 *        merge
 *        of
 *        range
 *        throw
 *        timer
 *        ...other operators
 *    不过最通用的方法还是使用observeOn()，任何observable都能使用这个方法
 */

/**
 * 1.queue：它的运行方式与直接执行很像，但是当我们使用到递归方法时，他会将这些行为组成队列而非直接执行，（一个递归的operator就是它会执行另一个operator）
 *          最好的例子就是repeat()，如果我们不给它参数的话将会无限执行多次，如：Rx.Observable.of(10).repeat().take(1).subscribe(console.log)
 *          这个例子在RxJS4.x版本会使得浏览器崩溃，因为take(1)永远不会被执行，repeat会一直重复要元素，**而在RxJS5中它预设了无限的observable为queue**
 *          **所以它会将repeat的next行为先用队列组合起来，而这时repeat就会回传一个可退订的对象给`take(1)`等到repeat的next第一次被执行就将结束**
 *   使用情景🌛：
 *      很适合在有递归的operator且有大量数据的时候使用，在这种情况下queue能避免不必要的能耗
 */

/**
 * 2.asap：它是非同步执行，在浏览器中其实就是setTimeout设为了0秒，asap因为都是在setTimeout中执行所以不会有**事件循环阻塞（block event loop）**的问题，
 *        很适合用在永远不会退订的observable上，例如事件监听。
 */

/**
 * 3.async：与asap很像，但是它是使用setInterval来运行的，通常与时间有关的operator才会用到。
 */

/**
 * 4.animationFrame：它使用Window.requestAnimationFrame这个API来实现的，所以执行周期与Window.requestAnimationFrame一样，
 *    一般在做复杂运算且高频率触发的UI动画师使用，能够搭配throttle来使用。
 * *一般animationFrame最常使用到，因为在RxJS 5之后已经针对各种情况给出了不同的预设，所以大多数时候无需自己手动设置Scheduler*
 */



const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

/**
 * # Code Observable 与 Hot Observable其实从本质上来看区别就在于它们的 **数据源** 是在Observable内部还是外部建立的
 * 二者是两个不同行为的Observable， 从表现上来看，CodeOb 是指每次订阅都是独立的（几乎所有Observable就是这样的），而HotOb则是共享订阅
 * **一般情况下的Observable都是Code Observable，这样对于不同的订阅来说才没有副作用。但有时候需要多次订阅时，则需要Hot Observable，我们能够通过Subject或者是Multicast Operators来实现Hot Observable。**
 */

/**
 * 1.Code Observable：代表了每次订阅都是独立的互不影响，用我们之前简单实现的Observable来表示就是数据源的建立是在Observable内部，
 *    所以每次订阅都相当于新建了一份数据源。
 */
// 下面是一个 CodeOb 的🌰：两次订阅互不影响
let oaInterval3 = Observable.interval(1000).take(3)
// oaInterval3.subscribe(console.log)
// setTimeout(() => {
//   oaInterval3.subscribe(console.log)
// }, 1000)

// 本质上，是因为数据源在Ob内部建立：
/**
 * ```JavaScript
 * const source = Rx.Observable.create(function (observer) {
 *    // 在内部订阅时，才建立的新数据源
 *    const someData = getData()
 *    someData.addEventListener('message', data => observer.next(data))
 * })
 * ```
 */



/**
 * 2.Hot Observable：其实就相当于之前引入Subject时说到的组播，多个订阅公用一份数据流，本质上来看就是数据源是在Observable外部建立的，所以每次订阅的数据源都是同一份
 */
// HotOb🌰：
let oaInterval5 = Observable.interval(1000).take(5).share() // 这里用广播操作符share来建立一个组播数据流
// oaInterval5.subscribe(console.log)
// setTimeout(() => {
//   oaInterval5.subscribe(console.log)
// }, 1000)

/**
 * Observable内部来看：
 * ```JavaScript
 * // 外部建立的唯一数据流
 * const someData = getData()
 * const source = Rx.Observable.create(function (observer) {
 *    someData.addEventListener('message', data => observer.next(data))
 * })
 * ```
 */

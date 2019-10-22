const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

let observerA = {
  next: (v) => console.log('A: ', v),
  error: (e) => console.log('A: ', e),
  complete: () => console.log('A complete!')
}
let observerB ={
  next: (v) => console.log('B: ', v),
  error: (e) => console.log('B: ', e),
  complete: () => console.log('B complete!')
}
/**
 * 广播操作符：📢📢📢📢📢
 */

//  1.multicast：我们知道在引出Subject时说到，其作用就是为了让后面订阅的Observer不要重新开始，而是接着上一个订阅者，共享一条数据流。在不使用Subject的情况下，其实我们也能够做到这点。
/**
 * multicast可以接收一个Subject用来挂载Subject，它会将这个Subject与Observable连结起来，并返回一个Subject（Observable）
 * 这个返回的对象能够像Subject一样使用，当调用其.connect()方法时，将会真正的调用Observable.subscribe(subject)，如下的例子
 *
 * 这里需要注意的是⚠️：在这个Subject（Observable）被Observer订阅时，会返回一个Subscriber对象，使用该对象的unsubscribe()方法退订只能够让本Observer不再获取数据流
 *            而无法让整个Observable停止；
 *            而当调用connect()对象是返回的时一个Subscription方法（即Subject对Observable订阅的返回值），只有在该对象上调用unsubscribe()才能够让整条关联的数据流被退订（此时AB才能被一起停下来）
 */
// let oaMulticast = Observable.interval(1000).take(3).multicast(new Rx.Subject())
// let oaA = oaMulticast.subscribe(observerA)
// let oaSub = oaMulticast.connect() // 真正开始订阅数据，没有执行connect()之前，是不会发出数据的
// setTimeout(() => {
//   let oaB = oaMulticast.subscribe(observerB)
// }, 1000)
// console.log('oaA: -->', oaA, 'oaSub: -->', oaSub)

// 2.refCount：必须与multicast搭配使用，它能够返回一个只要有订阅（subscribe）就能够自动connect()的Observable
/**
 * refCount能够在订阅数从0 -> 1时自动订阅上游Observable，
 * 同样在refCount的订阅数从x -> 0时，一样会自动停止发送（即：ObservableSubject.unsubscribe()）
 * interval: ---0---1---2---3...
 * do:       ---(0 && send: 0)---(...)...
 *           \             \
 *            \             ---(send:1 && B: 1)...
 * oaA         ---(send: 0 && A: 0)...
 */
let oaRefCount = Observable.interval(1000).do(x => console.log('send: ', x)).multicast(new Rx.Subject()).refCount()
// let oaA = oaRefCount.subscribe(observerA)
// setTimeout(() => {
//   let oaB = oaRefCount.subscribe(observerB)
// }, 1000)

// 3.publish：由于multicast(new Subject())非常常用，所以提供了一个语法糖，那就是publish，它等价于multicast(new Subject())
/**
 * At the same time：publish能够简单的实现Subject的三种变形：
 * 🤹‍♀️：（1）publish --> Subject
 *      （2）publishReplay --> ReplaySubject
 *      （3）publishBehavior --> BehaviorSubject
 *      （4）publishLast --> AsyncSubject
 * Add：另外publish + refCount能够简写成 `share`
 *    Observable.share() ==> Observable.publish().refCount() ==> Observable.multicast(new Subject).refCount()
 */
let oaPublish = Observable.interval(1000).publish().refCount()
// oaPublish.subscribe(observerA)
// setTimeout(() => {
//   oaPublish.subscribe(observerB)
// }, 1000)

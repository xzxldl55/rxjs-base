const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

/**
 * 一：组播：我们知道一个Observable是可以被多次订阅的，但每次订阅之间又是独立的互不影响。
 *      而如果想要第二次订阅的时候能够接着第一次订阅当前处理的元素开始，这就是组播。
 *      实现这种方式的概念其实很简单，可以建立一个中间人来处理Observable，将订阅动作，
 *      交付给中间人去处理，这样就只有"一条数据流"（中间人那条）
 *
 * 二：虽然乍一看Subject有着Observable的功能，但其实它本质上是一个Observer Pattern的实现，
 * 之所以具有Observable的方法是因为，Subject继承了Observable的类型，而在Subject内，
 * 其实主要只有next，error，complete，subscribe以及unsubscribe这几个方法的实现。
 * ✨**Subject跟Observable最大的区别，其实也就是Subject是具有状态的，他存储了一份订阅者的清单！**
 *
 * 三：❌：而正由于Subject的这个特性（for遍历清单将数据送出给订阅者），所以当一个订阅者订阅的数据流抛出错误时，
 *     将会影响到所有正在此条Subject的数据流同时被停止，如下：
 * let oa = Observable.interval(1000)
 * let sb = new Rx.Subject()
 * let error = sb.map(x => {
 *   if (x === 1)
 *     throw new Error('oops!')
 *   return x
 * })
 *
 * sb.subscribe(x => console.log('A: ', x))
 * error.subscribe(x => console.log('B: ', x))
 * sb.subscribe(x => console.log('C: ', x))
 * oa.subscribe(sb)
 *     在ObserverB接收到error抛出的错误后，整个程序将被终结，在现今版本（6.5.3）RxJs暂未处理这个问题，
 *     如果要消除这个问题，则需要给每一个Observer都加上Error的处理方法。
 *
 * 四：一定要用到Subject的情况：
 *    1⃣️就是最下面的，由于框架限制而不得不使用Subject来模拟Observable的情况
 *    2⃣️在某次Observable操作中产生了副作用（side-effect），而我们不希望这个side-effect因为需要被多次订阅而多次触发（单次订阅就不用考虑），如下：
 * let oaRes = Observable.interval(1000).take(6).map(x => Math.random()) // 此处有side-effect因为每次都不同随机数。（正常情况一般side-effect是调用API啥的）
 * let subA = oaRes.subscribe(x => console.log('A: ', x))
 * let subB = oaRes.subscribe(x => console.log('B: ', x))
 * oaRes.subscribe(subA)
 * oaRes.subscribe(subB)
 * // 两次打印的值是两个不同的数，说明Random被执行了两次，产生了副作用
 *   此时，使用Subject来重新构建，让A与B同时处在一条数据流（组播）即可
 */

/**--------简单实现一下：Rxjs的Subject其实就是使用了Observer模式，用中间人来控制组播。
let oaTestInterval = Observable.interval(1000).take(3)
let observerA = {
  next: (v) => console.log(v),
  error: (e) => console.log(e),
  complete: () => console.log('A complete!')
}
let observerB ={
  next: (v) => console.log(v),
  error: (e) => console.log(e),
  complete: () => console.log('B complete!')
}

// 中间人Subject
let testSubject = {
  observer: [], //订阅者observer数组
  subscribe: function (observer) { // 相当于订阅动作
    this.observer.push(observer)
  },
  next: function (value) {
    this.observer.forEach(o => o.next(value)) // 为每个订阅的observer执行方法分发上游数据流内容（这里有点像观察者模式的赶脚）
  },
  complete: function () {
    this.observer.forEach(o => o.complete())
  },
  error: function (e) {
    this.observer.forEach(o => o.error(e))
  }
}

// 只需要订阅中间人就行了
oaTestInterval.subscribe(testSubject)
// 其他控制交付中间人
testSubject.subscribe(observerA)
setTimeout(() => {
  testSubject.subscribe(observerB)
}, 1000)
-------------------**/

/**
 * 使用Rxjs自带的Subject跟我们自己写的是一样的：
 *    在Rxjs中Subject对于其他Observer来说它是一个Observable（因为可以被订阅），
 *    而对于Observable来说他又是一个Observer。
 * 所以它二者兼具，且Subject会对内部的Observers清单进行组播
 */
// let subject = Rx.Subject()
// oaInterval.subscribe(subject)
// subject.subscribe(observerA)
// subject.subscribe(observerB)
// 且由于Subject的这一特性，我们甚至能够直接使用Subject.next(msg)来模拟Observable数据流，而不用去订阅一个Observable
// 例如对于某些无法直接使用Observable的框架，我们能够使用Subject来模拟实现Observable触发事件/...
/**
 * class MyButton extends React.Component {
 *    constructor (props) {
 *        super(props)
 *        this.state = { count: 0 }
 *        this.subject = new Rx.Subject()
 *        this.subject.mapTo(1).scan((origin, next) => origin + next).subscribe(x => this.setState({ count: x }))
 *    }
 *    render () {
 *        // 这里由于onClick是React的事件而非原声DOM事件，所以无法使用Rx.fromEvent进行监听，所以则使用Subject来模拟Observable，onClick来触发subject的next函数以触发数据流
 *        return <button onClick={event => this.subject.next(event)}>{this.state.count} + 1</button>
 *    }
 * }
 */

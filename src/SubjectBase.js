const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

/**
 * 组播：我们知道一个Observable是可以被多次订阅的，但每次订阅之间又是独立的互不影响。
 *      而如果想要第二次订阅的时候能够接着第一次订阅当前处理的元素开始，这就是组播。
 *      实现这种方式的概念其实很简单，可以建立一个中间人来处理Observable，将订阅动作，
 *      交付给中间人去处理，这样就只有一条数据流（中间人那条）
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
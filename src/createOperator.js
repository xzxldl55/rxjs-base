const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
const { Product } = require('./somePattern')
/**
 * create
 * of
 * from
 * fromEvent  --> !!注：对于Event类型的Observable尽量不要使用unsubscribe，而是用takeUntil代替，表示在某个事件发生后complete这个Event Observable
 * fromEventPattern
 * fromPromise
 * never
 * empty
 * throwError
 * interval
 * timer
 */
// 1.create：传入一个callback来控制oa的流
let oaCreate = Observable.create((observer) => {
    observer.next(1)
    observer.complete(1)
})


// 2.of：传入简单的几个“值”，将其组成一个序列，并向下游吐出（next(v)）
let oaOf = Observable.of(...['xzx', 'ldl', '55'])
// oaOf.subscribe(v=>console.log(v))

// 3.from：将一个可迭代序列（Array，Set，WeakSet，Iterator，String...）转换为Observable，类似Es6中Array.from(iterator)，将一个可迭代序列转为Array对象
let oaFrom = Observable.from(['xzx', 'ldl', '55'])
// oaFrom.subscribe(v=>console.log(v))

// 4.fromEvent：为DOM设计的Operator，接收两个参数(DOM, Event)，每当Event在DOM上被触发时，将会调用next，要在DOM环境下才能使用
// let oaFromEvent = Rx.fromEvent(document.body, 'click')
// oaFromEvent.subscribe((e,v) => console.log(e, v))

// 5.fromEventPattern：这个方法类似与fromEvent，但它的适用对象为“类事件”，如somePattern.js中的Product这种。其接收两个参数，将类事件中的addListener与removeListener传入
let product = new Product()
let oaFromEventPattern = Observable.fromEventPattern(
    product.addListener.bind(product), // 不能直接传入，需要借托bind等调整this指向的方法
    product.removeListener.bind(product)
)
oaFromEventPattern.subscribe(v => console.log(v))
product.notify(product)

// 6.empty,never,throwError: empty --> 空oa，会直接complete； never --> 永远不会结束，但也什么都不发生； throwError --> 直接抛出错误
let oaEmpty = Observable.empty()
let oaNever = Observable.never()
let oaThrow = Observable.throwError('Oops!')
// oaThrow.subscribe(v => console.log(v))

// 9.interval, timer： interval --> 接收一个参数ms，将每各x ms吐出一个数据，从0开始； timer --> 接收两个参数，第一个为delay（发出第一个值之前的等待时间），第二个值的每个值间隔时间，也是从0开始
let oaInterval = Observable.interval(500)
// oaInterval.subscribe(v => console.log('Interval -> ', v))
let oaTimer = Observable.timer(1000, 500)
// oaTimer.subscribe(v => console.log('Timer -> ', v))

// 10.repeat：在没有错误时能够做到跟retry一样的效果，一直重复一段Observable，参数为重复次数（1就是没重复）不给就是♾
/**
 * 🉑️可以用来建立轮询
 */
let oaRepeat = Observable.from('xzxldl').zip(Observable.interval(200), (x, y) => x).repeat()
// oaRepeat.subscribe(console.log)

// 
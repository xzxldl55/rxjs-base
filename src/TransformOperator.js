const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
/**
 * 变化操作符：大多为实例化操作符，即必须将Observable实例化出来才能在实例对象上调用
 */


// 1.map：类同Array的map：
let oaMap = Observable.interval(1000).map(v => v + 'xzxldl55')
// oaMap.subscribe(console.log)

// 2.mapTo：将Observable的值改为一个固定值
let oaMapTo = Observable.interval(1000).mapTo('xzxldl55')
// oaMapTo.subscribe(console.log)

// 3.filter：过滤呗
let oaFilter = Observable.interval(1000).filter(v => v % 2 === 0)
// oaFilter.subscribe(console.log)

// 4.scan：与Array.reduce相似，接收两个参数，一是callback，一是初始值（可以不给）
//         callback，接收两个参数(preValue, currentValue)，即上一次操作的返回值与本次循环的元素
/**
 * of与interval的省略，只讨论scan：
 * ---1---('1'+'2'='12')---...
 */
let oaScan = Observable.of('1', '2', '3', '4', 'xzxldl55').zip(Observable.interval(300), (x, y) => x).scan((pre, cur) => (pre + cur))
// oaScan.subscribe(console.log)

// 5.buffer：实例化操作符，接收一个Observable，即O1.buffer(O2)，它会将O1内吐出的元素存储在数组中，只有当O2吐出元素时，才会将之前存储的O1元素数组释放并吐出
//          即，是用O2来触发O1
/**
 * O1: --x--z--x--l--d--l|
 * O2: ------0------1------2------3...
 * buffer: ------(xz)------(xld)| （在释放xld后O1继续又吐出了l，此时O1complete，导致整个Observable的结束，所以'l'就给他吃了，将不再输出）
 */
let oaBuffer = Observable.from('xzxldl').zip(Observable.interval(200), (x, y) => x).buffer(Observable.interval(600))
// oaBuffer.subscribe(console.log)

// 6.bufferTime：等同于buffer(Observable.interval(x))，即每隔x ms，释放并输出一次O1Array
/**
 * O1: --0--1--2--3--4--5--6...
 * O2: ------0------1------2------3------4...
 * BufferTime: ------[0,1]------[2,3,4]...
 *
 * 可用于节流(当持续触发事件时，不会每次都处理事件，而是在某个时间段内只处理一次，如一秒内不管你点多少下，我只请求一次数据)：下面这个例子，只有在500ms内双击才能触发处理事件
 * Observable.fromEvent(document, 'click').bufferTime(500).filter(arr => arr.length >= 2).subscribe(console.log('xzxldl'))
 */
let oaBufferTime = Observable.interval(200).bufferTime(600)
// oaBufferTime.subscribe(console.log)

// 7.bufferCount：异曲同工，使用数量来作为阀值
let oaBufferCount = Observable.interval(200).bufferCount(3)
// oaBufferCount.subscribe(console.log)

// 8.



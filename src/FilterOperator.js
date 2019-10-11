const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
/**
 * 过滤操作符：🐂🍺 也多为实例化操作符
 */
let oaInterval = Observable.interval(1000)
//  1.take：接收一个num参数，即取前n各参数就结束
let oaTake = oaInterval.take(5)
// oaTake.subscribe(console.log)

// 2.first：等于take(1)
let oaFirst = oaInterval.first()
// oaFirst.subscribe(console.log)

// 3.takeUntil(event)：在某事件发生后直接complete
// let oaClick = Observable.fromEvent(document.body, 'click')
// let oaTakeUntil = oaInterval.takeUntil(oaClick) // 点击之后就不再吐值
// oaTakeUntil.subscribe(console.log)

// 4.skip：跳过前n个元素再开始吐出，虽然不会吐出跳过的值，但是仍旧需要等待时间。
let oaSkip = oaInterval.skip(2) // 如，此例中，跳过两个值（0，1），将在第三秒后从2开始吐出值
// oaSkip.subscribe(console.log)

// 5.takeLast：取后面的n个值。需要注意的是，takeLast需要等待整个Observable完成之后才会开始（才能知道后面的值是什么）,并且为同步吐出
let oaTakeLast = oaTake.takeLast(2) // 即，等待5s后，将直接吐出3 4
// oaTakeLast.subscribe(console.log)
/**
 * oaTake:     ---0---1---2---3---4|
 * oaTakeLast: -------------------(34)|
 */

//  6.last：==> takeLast(1)
let oaLast = oaTake.last()
// oaLast.subscribe(console.log)

// 7.debounce：防抖(即，当持续触发一个事件时，在某一个时间段没有再触发该事件了，才会进行事件的处理) --> 类似与buffer的运行原理，debounce作用是，在每次收到元素后，将其存储，并等待一段时间(即参数所设事件，为其释放周期) 然后释放并吐出元素。
//                      但debounce的存储不会将收集到的元素放在一个数组内，而是在收到O1发出的新值后，替换掉存储的值，并重新等待x ms
//                      与debounceTime区别是，可以用click或别的事件来充当阀门
/**
 * 所以能够用来做前后端交互的防抖
 * O1: --0--1--2--3--4|
 * O2: ------0------1... (控制阀门)
 * debounce: --「O1吐出0，O2刷新等待600ms」--「O1吐出1，O2刷新等待事件600ms」--「O1吐出2，O2刷新600ms」--「O1吐出3，O2刷新600ms」--「O1吐出4，O2刷新600ms」------4|「O2等待期间O1没有来捣乱了，成功吐出值4，共计等待1600ms」
 */
let oaDebounce = Observable.interval(200).take(5).debounce(() => Observable.interval(600))
// oaDebounce.subscribe(console.log)

// 8.debounceTime：同上，参数为x ms
/**
 * O1: ('xzxldl')----0--1--2|
 * O2: ---0---1---2...
 * ret: ---('xzxldl')-「O1吐出0，O2刷新等待」--...
 */
let oaDebounceTime = Observable.interval(200).take(3).delay(400).startWith('xzxldl').debounceTime(300)
// oaDebounceTime.subscribe(console.log)

// 9.throttle：防抖有了，节流也要。使用方式跟防抖是一样的。但是运行原则上，节流是在某个时间段内只处理一次数据
/**
 * O1: --0--1--2--3--4--5--6--7--8--9--10...
 * O2: ----------0----------1...
 * throttle: --0--------「即在前面这1000ms内，O1吐出了0～4，但只处理一次，就是第一次」--5...
 */
let oaThrottle = Observable.interval(200).throttle(() => Observable.interval(1000))
// oaThrottle.subscribe(console.log)

// 10.throttleTime：一样哋
let oaThrottleTime = Observable.interval(200).throttleTime(1000)
// oaThrottleTime.subscribe(console.log)

// 11.distinct：顾名思义，就是过滤掉相同的值，可选择接收一个callback对传入的值进行有选择的比较，比如我们传入的数据是一个Json对象，所以即使他的值相同，但由于默认比较的是地址，所以无法被排除，此时则可使用callback来定义比较的值是对象中的某一个属性
/**
 * 如：
 * Observable.from([{v: 'a'}, {v: 'b'}, {v: 'a'}]).zip(Observable.interval(300), (x, y) => x).distinct(x => x.v)
 * ✨：需要注意的是，实际上distinct会在背地里建立一个Set（该Set为RxJs自己写的，不是Es6的），当接收到元素是会先去判断Set内是否存在相同的值，如果有则不吐出
 *     ，如果没有则存到Set并吐出。所以尽量不要讲distinct运用在一个无限的Observable中，防止Set越来越大，可改用distinctUntilChanged或接收第二个参数flushes
 * flushes为一个Observable，可以规定distinct在多久时间间隔后清楚之前存储的Distinct数据，如：
 *      Observable.from(['a', 'b', 'a', 'c', 'b']).zip(Observable.interval(300), (x, y) => x).distinct(null, Observable.interval(1300))
 * O: ---a---b---a---c---b|
 * flushes: -------------clear...
 * distinctSet: ---[a]=a---[a,b]=b---[a,b,a]=null---[a,b,c]=c-「clear Set」--[b]=b|
 */
let oaDistinct = Observable.from(['a', 'b', 'a', 'c', 'b']).zip(Observable.interval(300), (x, y) => x).distinct()
// oaDistinct.subscribe(console.log)

// 12.distinctUntilChanged：仅跟最后一次送出的元素进行比较，不会每个都比（所以也不用担心上面那家伙Set过大的问题）
/**
 * O1: ---a---b---c---c---b|
 * set: ---null---a---b---c---c|
 * ret: ---a!=null=>a---b!=a=>b---c!=b=>c---c===c=>null---b!=c=>b|
 */
let oaDistinctUntilChanged = Observable.from(['a', 'b', 'c', 'c', 'b']).zip(Observable.interval(300), (x, y) => x).distinctUntilChanged()
// oaDistinctUntilChanged.subscribe(console.log)

// 

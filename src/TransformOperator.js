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

// 8.window：将一维Observable转化成高阶Observable跟switch那几个对着来。运行原则跟buffer差不多，都是在一段时间内将上游送出的元素存放起来，等待阀门开启后送出，差别在于buffer将元素存在Array里面，而window存在Observable里面
/**
 * window接收一个参数来控制阀门：
 * O1: --0--1--2--3--4--5...
 * window: -----O-----O-----O-----O...
 * res: -----「释放前面存下的ObservableO1」--0--1--2--3--4...
 * 🌰：
 * 一般使用它的情况都比较复杂，比如记录1s内点击xx的次数
 * let oaClick = Observable.fromEvent(document, 'click')
 * let oaSource = Observable.interval(1000)
 * oaClick.window(oaSource).map(innerObservable => innerObservable.count()) // innerObservable就是window收集起来的clickObservable集合
 *    .subscribe(console.log) // 每隔1s打印一次这1s内点击次数
 */
let oaWindow = Observable.interval(1000).take(3).window(Observable.interval(2000))
// oaWindow.switch().subscribe(console.log)

// 9.windowToggle：window加强版！ 能够更加精细的控制收集上游传输数据的时间端段。接收两个参数，第一个是开始收集的Observable，的二个参数是callback，可以回传一个控制结束的Observable
/**
 * 就相当于上游是一条流水线，windowToggle是一个无限大的麻袋，你可以决定什么时候把麻袋放上去装东西什么时候撤下来，但是麻袋并不会影响流水线的运作
 * O1:    --0--1--2--3--4--5--6...
 * open:  ---- D---------------...
 * close: ----------------U------... (视觉上的时间，不用数-)
 * result:---- o---------------...
 *              \
 *              1--2--3--4-|
 * switch:----1--2--3--4-------------....
 */
// let oaWindowToggle = Observable.interval(200).windowToggle(Observable.fromEvent(document, 'mousedown'), (e) => Observable.fromEvent(document, 'mouseup'))
// oaWindowToggle.switch().subscribe(console.log)

// 10.windowCount：两个参数，第一个参数windowSize能够限制被分支的Observable能够发出的元素个数（即被组合出来的高阶Observable的最大元素个数）；第二个参数则规定规定了开启高阶Observable的间隔，就比如windowSize设置的是2，这个参数设置为3，那么windowToggle将会每隔3个源observable收集一次，收集的高阶Observable大小为2（就是说第三N个扔掉了不管了）
/**
 * 如，下面的🌰：从第三个点击事件开始，忽略第3N次点击
 * O源：---c1---c2--c3---c4---c5--...
 * HO: ------------[c1,c2（c3丢了）]--------[c4,c5（c6不要）]
 * mergeAll: ---------c1---c2-----------c4---c5------...
 */
// let clicks = Observable.fromEvent(document, 'click');
// clicks.windowCount(2, 3).mergeAll().subscribe(x => console.log(x))

// 11.windowTime：类似bufferTime，两个参数，第一个参数为收集时间，比如给1000那么就会收集1000ms内的源值；第二个参数为收集间隔时间，给5000ms那么就每隔5000ms收集一次
/**
 * 源： ----0----1----...----12----13----...
 * 收集时间： 「开始」----------「结束，1s内收集到[----0----1--|]」------...「5s间隔」...「开始」-----------「结束，1s内收集到[----12----13--|]」...
 * 然后摊平。。。
 */
let oaWindowTime = Observable.interval(400).windowTime(1000, 5000).mergeAll()
// oaWindowTime.subscribe(console.log)

// 12.groupBy：类似SQL里的分组，传入一个filterCallback来控制分组。它将回传一组被分过组的Observable
/**
 * let oaGroupBy = Observable.interval(200).take(10).groupBy(v => v % 2)
 * oaGroupBy.subscribe(console.log)
 * 源： --0--1--2--...--9|
 * groupBy: --O--O------|
 *            \   \
 *             \   1----3---5...9|
 *              0---2---4...10|
 */
let oaGroupBy = Observable.from([
  {
    name: 'xzx',
    score: 90,
    subject: 'English'
  },
  {
    name: 'xzx',
    score: 70,
    subject: 'Math'
  },
  {
    name: 'xzx',
    score: 100,
    subject: 'Chinese'
  },
  {
    name: 'ldl',
    score: 100,
    subject: 'Math'
  },
  {
    name: 'ldl',
    score: 60,
    subject: 'English'
  }
]).zip(Observable.interval(200), (x, y) => x).groupBy(person => person.name) //按名字分组
  .map(personGroup => personGroup.reduce((pre, cur) => ({ // 重组值
    name: cur.name,
    score: pre.score + cur.score
  }))).mergeAll() //打平
// oaGroupBy.subscribe(console.log)

// 13.

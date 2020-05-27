/**
 * 过滤操作符：
 *  filter：过滤不满足条件的
 *  first：
 *  last：
 *  take：
 *  takeLast：
 *  takeWhile & takeUntil：
 *  skip：
 *  skipWhile & skipUntil：
 *  throttleTime：
 *  debounceTime：
 *  auditTime：
 *  throttle：
 *  debounce：
 *  audit：
 *  sample：
 *  sampleTime：
 *  distnct：
 *  distnctUntilChanged：
 *  distnctUntilKeyChanged：
 *  ignoreElements：
 *  elementAt：
 *  single：
 * 
 * - 两个概念：
 *  - 判定函数：判定函数是过滤操作符的核心，当上游Observable数据符合判定函数，即返回true时，该值能够通过，并传递往下游，否则不予通过
 *  - 结果选择器：结果选择器类似于我们在mergeOperator里面谈到的project函数，能够对上游传来的值进行操作。在这里，结果选择器对通过判定函数的值做定制化需求，我们可以认为一个默认的filterOperator的结果选择器是：
 *    function resultSelector (value, index) { return value }
 */
import {outilObserver} from './outilObserver'
import { interval, of, timer } from 'rxjs'
import { filter, first, last, take, takeLast, takeWhile, takeUntil, skip, skipWhile, skipUntil, throttleTime, debounceTime } from 'rxjs/operators'

/**
 * 1、filter：最简单最常用的一个过滤操作符，使用一个判定函数来进行过滤，不支持结果选择器
 * 
 * interval: --0--1--2--3--4--5--6--7--8--...
 * filter:   --.--.--.--.--.--.--6--.--8--...
 */
var oaFilter$ = interval(500).pipe(filter((v, i) => v > 5 && v % 2 === 0))
// oaFilter$.subscribe(outilObserver)

/**
 * 2、first：功能类似我们在Auxiliary中说到的find & findIndex，即找到第一个满足判定函数的数据，但同时first还能够支持结果选择器，所以无需zip了。
 *    - 当不传入判定函数时，first默认取上游吐出的第一个数据
 *    - 当上游Observable完结了也没找到这么一个数据时，将会抛出错误：EmptyError：no elements in sequence
 *    - 可以传入第三个参数来作为默认值，把这个Error干掉
 */
var oaFirst$ = interval(500).pipe(first(v => v > 4, (v, i) => '值：' + v + ' index：' + i, undefined)) // 这里安装的这个版本不知道为啥不支持resultSelector，只支持predicate和defaultValue
// oaFirst$.subscribe(outilObserver)

/**
 * 3、last：和first正好相反，找出满足判定条件的最后一个数据，接收的参数同上
 */
var oaLast$ = of(2, 4, 5, 6, 8, 11).pipe(last(v => v % 2 === 0))
// oaLast$.subscribe(outilObserver)

/**
 * 4、take & takeLast & takeWhile & takeUntil：take一族的操作符都是用来“拿”数据的，拿前面几个，拿后面几个，拿啥时候出现的几个... 
 *    - take：拿前n个 (多个first)
 *       ----0----1----2----3----...
 *       ----0----1----2|->
 *    - takeLast：拿后n个 (多个last)
 *       (0,1,2,3,4)|->
 *       (2,3,4)|->
 *    - takeWhile：支持判定函数，工作原理是吐出满足判定函数的上游数据，直到判定函数为false才完结
 *    - takeUntil：让我们能够用一个Observable来控制另一个Observable对象的数据产生。其参数是另一个Observable对象的notifier，由这个notifier来控制什么时候结束从上游的Observable拿取数据。即当notifier开始吐出数据，终值这条数据流。
 * 
 *    takeUntil：
 */
var oaTake$ = interval(1000).pipe(take(3))
var oaTakeLast$ = of(0, 1, 2, 3, 4).pipe(takeLast(3))
// oaTake$.subscribe(outilObserver)
// oaTakeLast$.subscribe(outilObserver)

var oaTakeWhile$ = interval(1000).pipe(takeWhile((v, i) => i <= 4))
// oaTakeWhile$.subscribe(outilObserver)

var oaTakeUntil$ = interval(1000).pipe(takeUntil(timer(2500)))
// oaTakeUntil$.subscribe(outilObserver)

/**
 * 5、skip & skipWhile & skipUntil：
 *    - skip: 跳过前n个数据再开始取数据
 *    - skipWhile: 跳过满足判定条件的数据，直到判定条件为false，解除“禁锢”，不在对后面的进行跳过
 *        - 如下面的例子，第一个数据为0，被跳过了，第二个数据为1，判定条件为false，则不再进行判定过滤
 *    - skipUntil: 默认一直跳过，直到参数notifier发出数据则不再跳过。
 */
var oaSkip$ = interval(500).pipe(skip(4))
// oaSkip$.subscribe(outilObserver)
var oaSkipWhile$ = interval(500).pipe(skipWhile(v => v % 2 === 0))
// oaSkipWhile$.subscribe(outilObserver)
var oaSkipUntil$ = interval(500).pipe(skipUntil(timer(1600)))
// oaSkipUntil$.subscribe(outilObserver)

/**
 * 回压控制：在提到zip的时候，就说到过，当某个待zip的OA比另一个的数据产生的要更快时，
 *          OA的数据就需要被zip缓存下来，这样时间一长就将产生数据积压。
 *          回压现象的根源就是数据管道中某个环节数据涌入的速度超过了处理速度。
 *          那么既然处理不过来，就能通过舍弃一些涌入的数据来解决问题。
 * - 这种舍弃一部分数据的做法叫做“有损回压控制”：
 * - RxJS的过滤操作符中回压控制的有：
 * throttle & debounce & audit & sample 这四个完整的回压控制操作符，是以Observable为主角来控制的
 * 还有他们的简化版，直接用时间来控制：throttleTime & debounceTime & auditTime & sampleTime
 */

/**
 * 6、throttle && debounce：节流 & 防抖
 *  - throttleTime：节流，简而言之就是在某个时间段duration中，我们限制通过的数据流个数（比如，2秒内，我们只接收一次数据）
 *  - debounceTime：防抖，就是说传递给下游的数据间隔不能小于一个dueTime（比如设置dueTime为500，则上游传下来的数据必须在500ms后没有新数据留下来时才能被传递到下游）
 */
var oaThrottleTime$ = interval(500).pipe(throttleTime(1000)) // 1000ms内只接受一个数据流入下游
// oaThrottleTime$.subscribe(outilObserver) // --0--.--2--.--4--.--6...
var oaDebounceTime$ = interval(500).pipe(debounceTime(1000))
// oaDebounceTime$.subscribe(outilObserver) // --.--(这里还没到1000ms的等待时间就产生了新数据，所以上一个数据被舍弃了).--.--.--...


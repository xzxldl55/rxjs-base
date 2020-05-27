/**
 * 辅助类操作符：一些省事儿的操作符
 * count：统计数据流中产生的数据个数
 * max/min：显然！
 * reduce：
 * every：
 * find/findIndex：
 * isEmpty：
 * defaultIfEmpty：
 */
import {outilObserver} from './outilObserver'
import {
  count, concat, take, max, min, reduce, every, find, findIndex, isEmpty, defaultIfEmpty
} from 'rxjs/operators'
import { 
  interval, 
  of,
  zip,
  empty
} from 'rxjs'

// 数学类操作符：只有实例操作符形式 -> count、max、min、reduce
/**
 * 1、count：统计上游数据出现个数，所以如果上游数据永不完结，那么它也永远沉默着。其实这四个数学操作符都是这样的性格。
 */
var oaCount$ = interval(1000).pipe(take(2), concat(interval(500).pipe(take(3))), count())
// oaCount$.subscribe(outilObserver)

/**
 * 2、max & min：就是找大小
 * - 如果上游数据是“数字类型”那么很简单，比大小就完了！
 * - 但是如果不是数字类型的话，就需要我们给定一个比较函数：
 * function (a, b) {
 *    return a xx b // 如果a等于b返回0；a>b返回正数;a<b返回负数
 * }
 */
var data$ = of(
  {name: 'Jack', age: 18},
  {name: 'Tom', age: 25},
  {name: 'Ammy', age: 16}
)
var oaMax$ = data$.pipe(max((a, b) => a.age - b.age))
var oaMin$ = data$.pipe(min((a, b) => a.age - b.age))
// oaMax$.subscribe(outilObserver)
// oaMin$.subscribe(outilObserver)

/**
 * 3、reduce：对上游数据进行更加复杂的统计运算，与其他规约操作一样接收一个规约函数
 * function (accumulation, current) {
 *    // accumulation为累积的值
 *    //current为当前值
 * }
 * 通过在我们规约函数内定义的统计方法，reduce将依次扫描所有元素，对其调用这个规约函数，并返回统计方法操作后的“累积值”（比如你累积方法里面是accumulation + current，那么规约函数内的accumulattion就是之前集合内元素的累加）
 * - reduce其实还接收一个参数seed能够作为规约函数内accumulation的初始值，不传的话默认第一次的accumulation就是第一个值
 */
var oaReduce$ = data$.pipe(reduce((acc, c) => (acc + ' & ' + c.name + ':' + c.age), 'seed'))
// oaReduce$.subscribe(outilObserver)

// 条件类布尔操作符：这类操作符根据上游Observable对象产生的某些条件（依据判定函数）来产生一个新的Observable对象（很熟悉吧，完全能够通过map/filter操作符来实现其功能）
/**
 * 4、every：要求一个判定函数，该判定函数对上游的Observable吐出的所有数据进行检验，只有所有的吐出数据都满足这个判定函数，最后every才会吐出true，否则只要一个不满足就吐出false
 * ❤ 判定函数都接收三个参数
 * - value：当前扫描的值
 * - index：当前扫描值在源Observable内的index
 * - source$：源Observable
 * 
 * ❤：要注意的是，当every的上游Observable只要吐出一个不满足判定函数的值时，他就会立刻结束，不去等后面有啥了。
 *     所以最好不要对一个永不完结的Observable使用every，以免出现意外
 */
var oaEvery$ = interval(1000).pipe(every((value, index, source$) => value > 0))
// oaEvery$.subscribe(outilObserver)

/**
 * 5、find && findIndex：都是找到上游吐出的第一个符合条件的数据/数据的序号
 *    接收条件函数作为参数 (value, index, source$) => {}
 */
var oaFind$ = of(1, 3, 5, 2).pipe(find((v, i, s) => v % 5 === 0))
var oaFindIndex$ = of(1, 3, 5, 2).pipe(findIndex((v, i, s) => v % 2 === 0))
var findZip$ = zip(oaFind$, oaFindIndex$) // 这里把这两个合并一下，既能显示值也能显示index
// findZip$.subscribe(outilObserver)

/**
 * 6、isEmpty：检查上游Observable是否是空的（啥也没吐出来就结束了），当然要知道他是不是空的必须要等他吐出数据，或者是完结了才知道的
 */
var oaIsEmpty$ = empty().pipe(isEmpty())
// oaIsEmpty$.subscribe(outilObserver)

/**
 * 7、defaultIfEmpty：isEmpty的升级版，除了检测上游Observable是否为空，还要在上游却是为空时将我们设置的默认值吐出，如果上游不是空的，那么原样照搬上游的数据（类似用于做边界处理）
 */
var oaDefaultIfEmpty$ = interval(500).pipe(defaultIfEmpty('I love XzX'))
// oaDefaultIfEmpty$.subscribe(outilObserver)
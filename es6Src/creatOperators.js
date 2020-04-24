/**
 * 创建类操作符：
 *  同步数据流：数据的吐出是没有间隔的直接吐出
 *    create：等同于直接使用new Observable来创建
 *    of：列举数据
 *    range：取1增量的N个数
 *    generate：循环
 *    repeat：重复订阅Observable
 *    never：永不干活
 *    empty：空空如也
 *    throw：全是错的~
 * 
 *  异步数据流：有时间间隔的吐出数据
 *    interval：顾名思义啊（从0开始吐出整数）
 *    timer：也对应了setTimeout，参数可以是毫秒数值，也可以是个Date对象，Date对象就厉害了那就等到了那个时间就吐出
 */
import {Observable} from 'rxjs/Observable'
import {of} from 'rxjs/observable/of'
import {range} from 'rxjs/observable/range'
import { 
  generate, 
  empty,
  never,
  interval,
  timer,
  from,
} from 'rxjs'
import {repeat, take} from 'rxjs/operators'
import {_throw} from 'rxjs/observable/throw'
import { fromPromise } from 'rxjs/internal-compatibility'

// 工具人Observer
let outilObserver = {
  next: v => console.log(v),
  error: err => console.error(err),
  complete: () => console.log('Over!')
}

// 1、creaet 本身就在Observable的类定义内，所以无需额外引入
let oaCreate$ = Observable.create(observer => {
  observer.next(1)
})
// oaCreate$.subscribe(outilObserver)

// 2、of：主要作用就是简化一个简短的数据流的产生，省的在构造函数里写一堆next
let oaOf$ = of(1, 'xzx', '2')
// oaOf$.subscribe(outilObserver)

// 3、range：顾名思义能够简便的产生一组连续的数据流 (开始数, 总共产生数字个数)
let oaRange$ = range(0, 100) // 0-99即100个数
// oaRange$.subscribe(outilObserver)

// 4、generate：循环创建数据流，多样化复杂化的range
/**
 * 接收四个参数，分别对应for循环内的四个指标
 * for(initValue; condition; increment) {result}
 * (initValue, condition, increment, result)
 * 1、初始值类似var i = 0
 * 2、条件：即i < 10
 * 3、增加量：类似i++
 * 4、结果：i*i
 */
let oaGenerate$ = generate(
  2,
  value => value < 10,
  value => value + 2,
  value => value * value
)
// oaGenerate$.subscribe(outilObserver)

// 5、repeat：重复数据流，实例化操作符。
/**
 * 其实质是重复对上游Observable的订阅，但只有当上游Observable数据流结束后才会重新开始订阅，所以使用repeat时，别整个永不完结的Observable在上游
 * 注意：repeat是实例操作符，所以不能只使用函数导入的形式，应使用“lettable导入”或“打补丁”的方式导入。下面的例子是lettable的方式
 */
let oaRepeat$ = oaOf$.pipe(repeat(10))
// oaRepeat$.subscribe(outilObserver)

// 6、三兄弟操作符：empty、never、throw：三个极简的操作符，顾名思义就只能做这个事儿
/**
 * 弹珠图：
 * 1、empty： |---------------------------> 直接就结束了
 * 2、never： ----------------------------> 就啥也不干，一直也不结束
 * 3、throw： ×---------------------------> 直接就报错了
 * 不过，需要注意的是throw是JS的关键字，所以对于throw操作符有以下两种方法引入
 *    1. 打补丁，因为挂载在Observable所以没有冲突了 import 'rxjs/add/observable/throw'
 *    2. 导入名为_throw ==> import {_throw} from 'rxjs/observable/throw'
 */
let oaEmpty$ = empty()
let oaNever$ = never()
let oaThrow$ = _throw(new Error('哦错误哦！'))
// oaThrow$.subscribe(outilObserver)

// 7、interval && timer
/**
 * interval就不谈了
 * timer可以选择接收第二个参数，代表了持续吐出时间的间隔，如下第一个参数代表开始吐出第一个参数的时间，第二个代表后面的数据吐出的间隔
 * ----0--1--2--3--...-->
 */
let oaInterval$ = interval(1000).pipe(take(3)) // 用take取前三个值，省的一直吐
// oaInterval$.subscribe(outilObserver)
let oaTimer$ = timer(new Date(Date.now() + 1000), 500)
// oaTimer$.subscribe(outilObserver)

// 8、from：有点像Array.from能够将类数组转化为真数组一样，from能够吧任何像Observable的东西转化为真的Observable（Array, String, Promise, Generator, Iterable, DOM类数组, 函数参数arguments...）
let oaFrom$ = from(
  new Promise((res, rej) => {
    setTimeout(() => {
      res('xzxldl')
    }, 500)
  }).then(result => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(result + '520')
      }, 1000)
    })
  })
) // 其他的不用说，这里举例Promise，在1500毫秒后将吐出xzxldl520
// oaFrom$.subscribe(outilObserver)

// 9、fromPromise：等同于from接收一个Promise ==> Promise成功 --> 吐出数据 + complete || 失败 --> error
let oaFromPromise$ = fromPromise(
  new Promise((res, rej) => {
    setTimeout(() => {
      res('xzxldl')
    }, 500)
  }).then(result => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(result + '520')
      }, 1000)
    })
  })
)
// oaFromPromise$.subscribe(outilObserver)

// 10、fromEvent：
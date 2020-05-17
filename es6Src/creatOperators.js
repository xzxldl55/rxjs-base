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
 *    from：类数组转换为Observable
 *    fromPromise：将Promise转化
 *    fromEvent：将DOM事件转化
 *    fromEventPattern：将类事件转化
 *    ajax：ajax转化
 *    repeatWhen：可控制重复调用时间的repeat
 *    defer：延迟创建Observable
 */
import {outilObserver} from './outilObserver'
import {EventEmitter} from 'events'
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
  fromEvent,
  fromEventPattern,
  defer,
} from 'rxjs'
import {repeat, take, repeatWhen, delay} from 'rxjs/operators'
import {_throw} from 'rxjs/observable/throw'
import { fromPromise, ajax } from 'rxjs/internal-compatibility'


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
 * interval就不谈，即在订阅后的 n毫秒后开始吐出数据，每隔n 毫秒吐一个
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

// 10、fromEvent：DOM与Rx的桥梁，将DOM事件转化为Observable流（DOM， 事件名） || 除此外，其他Event事件也可适用，如NodeJS的EventEmitter
/**
 * 假设有如下DOM
 * <div>
 *    <button id='btn'>click me</button>
 *    <span id='text'>0</span>
 * </div>
 * 则可做如下操作
 * 当触发事件时便会向下游吐出数据，从而触发Observer的操作
 */
// let oaFromEvent$ = fromEvent(document.getElementById('btn', 'click'))
// oaFromEvent$.subscribe(() => {
//   document.getElementById('text').innerHTML += 1
// })

// 11、fromEventPattern：某些情况下事件源可能并没有DOM事件那么相像，则需要灵活度更高的操作符了。
/**
 * 接收两个参数，分别是Observable订阅时的操作，与其退订时的操作
 * fromEventPattern提供的就是一种模式，而不管数据源如何。
 * 当subscribe调用时就会去调用其传入的第一个参数'addHandler'
 * 当unsubscribe调用则调用其第二个参数'removeHandler'
 */
let emitter = new EventEmitter()
const addHandler = (handler) => { // 订阅操作
  emitter.addListener('msg', handler)
}
const removeHandler = (handler) => {
  emitter.removeListener('msg', handler)
}
let oaFromEventPattern$ = fromEventPattern(addHandler, removeHandler)
// const registeroaFromEventPattern$ = oaFromEventPattern$.subscribe(outilObserver)
// emitter.emit('msg', 'hello') // 触发msg事件传入数据hello
// emitter.emit('msg', 'world')
// registeroaFromEventPattern$.unsubscribe() // 退订
// emitter.emit('msg', '退订了你就接收不到了')

// 12、ajax：即将Ajax请求转变为Observable || tip: 一般配合组合操作符很猛
let oaAjax$ = ajax('http://localhost:8888/test', {resopnseType: 'json'})
// oaAjax$.subscribe(outilObserver)

// 13、repeatWhen：repeat只能重复订阅上游Observable但无法控制订阅的时间，repeatWhen就出现了。
/**
 * 其接受一个函数参数，在该函数参数内返回一个Observable来控制合适去重复订阅上游数据
 * 该函数参数也可以接收一个参数，我们称作“notification$”该参数特点是，当repeatWhen上游数据完结的时候会吐出一个数据，所以我们能够用这个参数来控制上游是异步数据流的情况
 */
let notifier = (notification$) => {
  // return interval(1000)
  return notification$.pipe(delay(2000)) // 异步数据流使用notification来控制，保证在上游结束后再调用
}
let oaRepeatWhen$ = oaOf$.pipe(repeatWhen(notifier))
// oaRepeatWhen$.subscribe(outilObserver)

// 14、defer：有这种情况，一方面我们希望能预先定义好一个Observable，这样方便我们订阅，但同时我们又不希望它过早存在从而一直占用着资源。这时出现了defer：
/**
 * defer接收一个函数作为参数，该函数需要返回一个Observable，即我们上面说的想预先定义但又不想过早创建占用内存的Observable | 同时其也支持返回Promise（因为可以有fromPromise，rxjs帮你做转换了）
 * 只有当defer的Observable被订阅了，其参数内返回的Observable才会被创建出来。
 * 场景：就比如，我们再进行Ajax请求时，我们不想再服务刚启动就将这个Ajax请求发出去，就可以使用defer将其包起来 ->
 * ```
 *  const observableFactory = () => ajax(ajaxUrl)
 *  const source$ = defer(observableFactory)
 * ```
 */
const observableFactory = () => of(1,2,3)
let oaDefer$ = defer(observableFactory)
// oaDefer$.subscribe(outilObserver)



export {oaOf$, oaInterval$} // 导出去一下给别的文件用
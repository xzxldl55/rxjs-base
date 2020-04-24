# rxjs🐂🍺base

## 三个特性：
- 声明式编程
- 纯函数：
  - 不改变全局变量值
  - 不改变输入参数引用的对象
  - 不读取用户输入（eg：alert，confirm）
  - 不操作DOM
  - ...
  - 重要的一点理解是：纯函数做的事情就是输入参数到返回结果的一个映射，不产生副作用
- 数据不可变（Immutable数据）：保持原有数据不变，产生新的数据

- **一个核心三个重点：Observable+Observer+Subject+Scheduler**

## 弹珠图

- 规则：
  - `-`：小段时间
  - `X`：错误
  - `|`：observable结束
  - `()`：代表同步发生
  - eg:

```pseudoscope
// Rx.Observable.interval(1000):
----0----1----2----3----...
// Rx.Observable.of(1,2,3,4)
(1234)|
```

## Observable特性：

- 渐进式取值：每次都只处理一个Observable流
- 延迟运算：订阅之后才会进行运算
- Observer Pattern && Iterator Pattern两种模式思想的结合，具备生产者推送资料，又同时能够像一个Iterator序列一样拥有处理序列的方法（Map, filter, reduce...）

## Hot Observable && Cold Observable：
- Hot Observable：即所有observer观测的都是同一条不被其影响的数据流（Observable与Observer独立开来，不被Observer影响），如我们看电视的时候，打开电视（Observable），电视放到什么节目就是什么节目，不会说某个人打开，电视就要重新开始放。
- Cold Observable：与上面相反，就是每一次Observer的订阅获取到的数据流都是一样的完整的，不会因为谁后订阅而丢失掉前面吐出的数据。就像看视频网站时，我们能够随时点播视频。

## 新增操作符
- 1、打补丁：即直接对Observable.prototype/Observable进行操作，将实例方法或者静态方法添加上去（注意不要乱用箭头函数，因为this） --> ×极其不推荐，因为会产生对全局Observable的污染
- 2、使用Bind绑定特定的Observable对象：上面打补丁的方法会影响到全局的Observable，而使用bind则能够仅仅只对某些Observable实例对象进行操作符改造或添加。但使用bind会导致没法链式调用了，我们可以使用绑定操作符`::`来解决
- 3、使用lift函数：lift是一个实例函数，它会返回一个新的Observable对象，通过传递给lift的函数参数能够赋予这个新的Observable对象特殊功能
```
// 打补丁
Observable.prototype.map = function (func) {
  return new Observable(observer => {
    // 自动订阅上游
    const sub = this.subscribe({
      next: v => observer.next(func(v)),
      error: error => observer.error(error),
      complete: () => observer.complete()
    })
    // 当观察者解绑时，自动执行解绑
    return {
      unsubscribe: () => sub.unsubscribe()
    }
  })
}

Observable.of(1,2,3).map(v => v * 2).subscribe(console.log)

// bind
const map = function (func) {....}

const operator = map.bind(source$)
const result = operator(x => x+1)

// 绑定操作符
const result$ = source$::map(x => x+1)::map(x => x*2).filter(...) // 且还能与.操作符混用


```

## 操作符的导入
- 1、打补丁导入：`import 'rxjs/add/operator/map'`或`import 'rxjs/add/observable/of`，用来直接导入实例方法或静态方法，其实，这两个文件内部并没有对相对应操作符的定义，而只是从别处引入操作符定义函数，并将其打补丁到了Observable上面，可见`'rxjs/add/operator/map'`的代码：
```
var rxjs_1 = require("rxjs");
var map_1 = require("../../operator/map");
rxjs_1.Observable.prototype.map = map_1.map;
// 仅仅是将map打补丁到了rxjs上
```
- 2、函数导入：函数导入就是上面打补丁文件里面所导入的函数了，所以我们也需要对其命名，在使用时使用其变量名，他们的区别就是打补丁是从`'rxjs/add/xxx'`导入的，而函数导入直接从`'rxjs/xxx'`导入
```
import {map} 'rxjs/operator/map'
import {of} 'rxjs/observable/of'

const source$ = of(1,2,3)
const source$2 = source$::map(x=>x+1) // 这里要使用绑定操作符，因为map是作为一个单独的函数导入的，并没有挂载到Observable实例上面咯。
```

- 3、支持Tree Shaking的lettable && pipeable（本来叫lettable，但是不好理解改成了pipeable）：导入目录改为了 `'rxjs/operators/xx'` （注：是operators是复数！）
  - pipeable是一种使用操作符的方式，它能够配合Tree shaking来删除死代码，优化压缩
  - 静态操作符没有lettable的对应形式；拥有多个上游Observable对象的操作符没有对应的lettable形式
  ```
  import {of} from 'rxjs/observable/of'
  import {map} from 'rxjs/operators' // 这里直接导入rxjs/operators/index，其内自动导入了操作符的引用

  const source$ = of(1,2,3)
  const result$ = source$.pipe(
    map(x => x * x)
  )
  result$.subscribe(console.log)
  ```

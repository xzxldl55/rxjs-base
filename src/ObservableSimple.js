/**
 * 简单的实现Observable：
 * 重点概念：Observable与ObserverPattern是不同的，Observable在内部并没有管理一份订阅清单，订阅一个Observable就像是执行一个function一样，所以实现的重点在于：
 *      - 订阅就是执行一个function
 *      - 订阅会接受的对象具备next，error，complete三个方法
 *      - 订阅会返回一个可供退订的unsubscribe的对象
 */

// ✨基本Observable的实现：
function create(subscriber) {
  var observable = {
    subscribe: function (observerOrNext, error, complete) {
      const realObserver = new Observer(observerOrNext, error, complete) // 将传入的observer对象转换为真正的Observer实例
      subscriber(realObserver)
      return realObserver
    }
  }
  return observable
}

// ✨预设一个空的observer
const emptyObserver = {
  next: () => { },
  error: (err) => { throw err },
  complete: () => { }
}
// ✨Observer
class Observer {
  constructor (destinationOrNext, error, complete) {
    switch (arguments.length) {
      case 0:
        // 空的observer
        this.destination = this.safeObserver(emptyObserver)
        break
      case 1:
        if (!destinationOrNext) {
          // 没有next方法，空的observer
          this.destination = this.safeObserver(emptyObserver)
          break
        }
        // 多添加一层判断：是否传入的destinationOrNext原本就是Observer实例，如果是则无需再执行this.safeObserver
        if (destinationOrNext instanceof Observer) {
          this.destination = destinationOrNext
          break
        }
        if (typeof destinationOrNext === 'object') {
          // 传入了一个observer对象
          this.destination = this.safeObserver(destinationOrNext)
          break
        }
      default:
        // 传入了三个方法
        this.destination = this.safeObserver(destinationOrNext, error, complete)
        break
    }
  }
  // 返回一个正常的observer
  safeObserver (observerOrNext, error, complete) {
    let next
    if (typeof(observerOrNext) === 'function') {
      // 则为next方法
      next = observerOrNext
    } else if (observerOrNext) { // 存在这个observerOrNext，则为对象
      next = observerOrNext.next || (() => { }) // 则next为对象的next方法，若无next方法，则为空方法
      error = observerOrNext.error || function (err) {
        throw err
      }
      complete = observerOrNext.complete || (() => { })
    }
    return {
      next: next,
      error: error,
      complete: complete
    }
  }
  unsubscribe () {
    // 添加一个是否曾经结束的flag
    this.isStopped = true
  }
  // 三个方法
  next (value) {
    if (!this.isStopped && this.next) { // 判断是否停止过
      try { // 调用next方法
        this.destination.next(value)
      } catch (err) { // 捕获到错误则退订且抛出错误
        this.unsubscribe()
        // throw new Error(err)
      }
    }
  }
  error (err) {
    if (!this.isStopped && this.error) {
      try {
        this.destination.error(err)
      } catch (otherErr) {
        this.unsubscribe()
        // throw new Error(otherErr)
      }
    }
  }
  complete () {
    if (!this.isStopped && this.complete) {
      try {
        this.destination.complete()
      } catch (err) {
        this.unsubscribe()
        // throw new Error(err)
      } finally {
        this.unsubscribe() // 无论如何退订之！
      }
    }
  }
}
// ✨operator其实就是在原本的observer上做了一层包装，让next执行前对元素做处理，所以可以将Observer改写建立一个MapObserver
class MapObserver extends Observer {
  constructor (observer, callback) {
    // 传入原本的observer与map的callback
    super(observer) // 继承一下父类
    this.callback = callback
    this.next = this.next.bind(this) // 确保next的this
  }
  // 重写next方法
  next(value) {
    try {
      // 调用父类传下来的destination，并调用mapCallback方法将结果传回next函数
      this.destination.next(this.callback(value))
    } catch (err) {
      this.destination.error(err)
      return
    }
  }
}


// 测试 Simple
// let oaObservableTest = create(function (observer) {
//   observer.next(1)
//   observer.next(2)
//   observer.next(3)
//   observer.next(4)
//   observer.complete()
//   observer.next('not work')
// })
// let testObserver = {
//   next: function (value) {
//     console.log(value)
//   },
//   complete: function () {
//     console.log('complete')
//   }
// }
// oaObservableTest.subscribe(testObserver)


// ✨完善一些的Observable
class Observable {
  constructor (subscribe) {
    if (subscribe) {
      this._subscribe = subscribe
    }
    this.source = undefined
    this.operator = undefined
  }
  subscribe () {
    const observer = new Observer(...arguments)
    // 先判断，当前observable是否具有operator，如果有则不能直接交付给this._subscribe方法，而是限制性operator
    if (this.operator) {
      // operator!
      this.operator.call(observer, this.source) // 传入订阅者与源observable
    } else {
      // 若没有operator则将其丢给this._subscribe执行
      this._subscribe(observer) // 执行传入的行为函数
    }
    return observer // 返回observer，observer存在一个unsubscribe方法
  }
  /**
   * @param {Function} callback 处理函数
   * map需要做三件事：
   * - 建立一个新的observable
   * - 保存原本的observable --> 如此才能有办法执行之前的行为
   * - 建立并保存operator本身的行为，等到订阅时执行
   */
  map (callback) {
    const observable = new Observable() // 建立一个新的Observable
    observable.source = this // 保存当前的observable
    observable.operator = { // 存储当前operator的行为，并作为是否有operator的依据
      call: (observer, source) => {
        // 执行这个operator的行为
        const newObserver = new MapObserver(observer, callback) // 建立已经被map改造了的Observer，并用源Observable订阅并返回
        return source.subscribe(newObserver)
      }
    }
    return observable
  }
}
// 测试 2
// let observable = new Observable(function (observer) {
//   observer.next(1)
//   observer.next(2)
//   observer.next(3)
//   observer.complete()
//   observer.next('not work!')
// })
let observer = {
  next: function (value) {
    console.log(value)
  },
  complete: function () {
    console.log('complete!')
  }
}
// observable.subscribe(observer)

// ✨添加静态方法create
Observable.create = function (subscribe) {
  return new Observable(subscribe)
}
// 测试静态方法create
// let observable = Observable.create(function (observer) {
//   observer.next(1)
//   observer.next(2)
//   observer.next(3)
//   observer.complete()
//   observer.next('not work!')
// })
// observable.subscribe(observer)

// ✨fromArray：static方法建立
/**
 * @param {Array} array 传入数组将其转化为Observable行为
 */
Observable.fromArray = function (array) {
  if (!Array.isArray(array)) {
    throw new Error('请传入一个数组！')
  }
  return new Observable(function (observer) { // 变化的只是callback内的内容
    try {
      // 遍历每个元素并送出
      array.forEach(v => observer.next(v))
      observer.complete()
    } catch (err) {
      observer.error(err)
    }
  })
}
// 测试fromArray
// var observable = Observable.fromArray([1, 2, 3, 4, 5])
// observable.subscribe(observer)

// ✨transform - map操作符（实例化方法！）
/**
 * 重点：
 * - operators基本都是回传一个新的observable
 * - 大部分的operator其实就是在原本observer外包裹一层对象，让执行next方法之前再将元素做一次处理
 * - operator回传的observable订阅时，还是需要执行原本的observable（在operator前的），即我们需要保留原来的源observable
 * ==> 在class内实现
 */
// map测试
// let observable = Observable.fromArray([1, 2, 3, 4, 5]).map(value => value * 2)
// observable.subscribe(observer)
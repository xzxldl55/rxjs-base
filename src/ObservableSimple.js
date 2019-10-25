/**
 * 简单的实现Observable：
 * 重点概念：Observable与ObserverPattern是不同的，Observable在内部并没有管理一份订阅清单，订阅一个Observable就像是执行一个function一样，所以实现的重点在于：
 *      - 订阅就是执行一个function
 *      - 订阅会接受的对象具备next，error，complete三个方法
 *      - 订阅会返回一个可供退订的unsubscribe的对象
 */

// 基本Observable的实现：
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

// 预设一个空的observer
const emptyObserver = {
  next: () => { },
  error: (err) => { throw err },
  complete: () => { }
}
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


// 测试
let oaObservableTest = create(function (observer) {
  observer.next(1)
  observer.next(2)
  observer.next(3)
  observer.next(4)
  observer.complete()
  observer.next('not work')
})
let testObserver = {
  next: function (value) {
    console.log(value)
  },
  complete: function () {
    console.log('complete')
  }
}
// oaObservableTest.subscribe(testObserver)

// 完善一些的Observable

class Observable {
  constructor (subscribe) {
    if (subscribe) {
      this._subscribe = subscribe
    }
  }
  subscribe() {
    const observer = new Observer(...arguments)
    this._subscribe(observer) // 执行传入的行为函数
    return observer // 返回observer，observer存在一个unsubscribe方法
  }
  
}
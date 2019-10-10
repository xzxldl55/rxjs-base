const Rx = require('rxjs')
/**
 * 需要遵循几个原则：
 * 1⃣️Pure function，不影响原来的Observable
 * 2⃣️返回一个新的Observable，即为了实现上面的要求
 * 3⃣️确保在返回的Observable内部进行订阅
 * 4⃣️处理异常情况try/catch
 */

//  Example
function mySimpleOperator (someCallback) {
    // 需要注意好this指向，以下将会使用箭头函数，所以不需要对this指引
    return Rx.Observable.create(observer => {
        const source = this
        // 存储内部的subscription的状态(因为会返回新的Observable，而外部的Observer是没有自动对新的Observable订阅的)，所以要在此处进行订阅
        const subscription = source.subscribe(
            value => {
                try {
                    observer.next(someCallback(value)) // 对其用callBack进行改造，需要用try/catch防止错误
                } catch (err) {
                    observer.error(err)
                }
            },
            // 接收error
            err => observer.error(err),
            () => observer.complete()
        )
        // 最后将新的subscription返回
        return subscription
    })
}

// 将新的Operator挂在的方法：
// 1⃣️：使用Es7的绑定操作符::  (babel环境下)
// someObservabel::mySimpleOperator(x => x + '!')
// 2⃣️：创建Observable子类
class MyObservabel extends Rx.Observable {
    lift (operator) {
        const observabel = new MyObservabel()
        observabel.source = this
        observabel.operator = operator
        return observabel
    }
    mySimpleOperator(callback) {
        return mySimpleOperator(callback)
    }
}
// 3⃣️：原型链继承
Rx.Observable.prototype.mySimpleOperator = mySimpleOperator
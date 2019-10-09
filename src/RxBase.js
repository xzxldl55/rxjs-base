const Rx = require('rxjs')

/**
 * # 一个核心，三个重点：✨ Observable（Operators）， . Observer，. Subject， . Schedulers
 * - Observable： 虽然其看起来像是一个Observer模式的生产者，但其实不然，它并没有在内部维护一组listeners的清单，而是像Iterator让订阅者拉取数据
 * - Observer：观察者，用于订阅（或者说观察）Observable。观察者是一个具有三个方法的对象，每当Observable发生事件时，便会去调动观察者相对应的方法（这里的方法有点像观察者模式）
 *      观察者的三个方法为：
 *          1⃣️next： 每当Observable发送出新的值，next将会被调用
 *          2⃣️complete： 在Observable已经被榨干了后，将会被调用，此后next将不会在起作用
 *          3⃣️error： Observable内部发生错误时将会被调用
 */

//  Observable --> Create：非实例化方法
var o1 =Rx.Observable.create((observer) => {
    observer.next('1')
    observer.next('xzx')
    observer.complete()
    try {
        throw 'NaN'
    } catch (error) {
        observer.error(error)
    }
})
// Observer --> 订阅之：只传一个方法的话，默认其为next
var observer1 = {
    next: (v) => console.log(v),
    complete: () => console.log('complete'),
    error: (error) => console.log('Error: ', error)
}
o1.subscribe(observer1)
o1.subscribe((value) => console.log(value))
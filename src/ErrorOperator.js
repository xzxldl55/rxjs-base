const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
/**
 * 错误处理操作符
 */

//  1.catch：常见的异步错误处理方法，接收一个callback，callback内回传一个Observable来送出error信息
/**
 * catch到错误后回传一个empty直接结束流（对empty插入了一段输出，即输出完错误就结束）
 * catch的callback还能够接收第二个参数，这个参数接收当前的Observable对象，将它回传就等于再循环运行一遍（比如可以用来断线重连什么的）
 */
let oaCatch = Observable.from(['a', 'b', 'c', 2, 'd']).zip(Observable.interval(200), (x, y) => x).map(x => x.toUpperCase()).catch(error => Observable.empty().startWith('错误：' + error))
// oaCatch.subscribe(console.log)

// 2.retry：发生错误时，重新尝试运行。（更前面说的catch的callback回传第二个参数一样）。retry接收一个参数代表重运行次数，不传时为♾
let oaRetry = Observable.from(['a', 'b', 2, 'c']).zip(Observable.interval(200), (x, y) => x).map(v => v.toUpperCase()).retry(1).catch(err => Observable.empty().startWith('Error: ', err))
// oaRetry.subscribe(console.log)

// 3.retryWhen：它能够让我们单独地将发生错误的元素放到另一个Observable来控制，并等到这个ErrorObservable操作完成后再重新订阅一次原本的Observable（ErrorObservable的操作再callback内完成，但并不会被吐出的）
/**
 * O1: --A--B--X|
 * ErrorObs: ----------ErrorObsDelay|
 * result: --A--B--「X」----------「callback内的Delay」--A--B...
 * 🆙不过一般不用它来做重连，而是用catch。一般可以使用retryWhen做监控，遇到错误时，将错误上传至后台xxx的
 */
let oaRetryWhen = Observable.from(['a', 'b', 2, 'c']).zip(Observable.interval(200), (x, y) => x).map(v => v.toUpperCase()).retryWhen(errorObs => errorObs.delay(1000))
// oaRetryWhen.subscribe(console.log)

// 4.


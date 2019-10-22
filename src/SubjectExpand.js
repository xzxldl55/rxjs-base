"use strict";
exports.__esModule = true;
var Rx = require("rxjs/Rx");
var Observable = Rx.Observable;
var observerA = {
    next: function (value) { return console.log('A: ', value); },
    error: function (err) { return console.log('A: ', err); },
    complete: function () { return console.log('A is complete!'); }
};
var observerB = {
    next: function (value) { return console.log('B: ', value); },
    error: function (err) { return console.log('B: ', err); },
    complete: function () { return console.log('B is complete!'); }
};
/**
 * Subject变种形式：
 */
// 1.BehaviorSubject：
/**
 * 有时候，我们希望我们的Subject不是单纯的进行事件的发送，而是存储当前事件流的状态，
 * 比如在Subject中我们的数据流已经流完了，此时我们再进行一个Observer的订阅，那么对于普通的Subject来说将不会push任何数据到下游.
 * 而BehaviorSubject则是解决这个问题的Subject，对于BehaviorSubject来说，它会记住最新一次发送的数据流，并当作当前的值存储。
 * 构建Behavior时需要传入一个参数来代表它的起始状态 --> **重要的是，BehaviorSubject代表的是“状态”跟普通的Subject是有着性质的不同的
 */
var behaviorSubject = new Rx.BehaviorSubject(0);
// behaviorSubject.subscribe(observerA)
// behaviorSubject.next(1)
// behaviorSubject.next(2)
// behaviorSubject.next(3)
// setTimeout(() => {
//   behaviorSubject.subscribe(observerB) // 此时B依旧能够收到值 --> 3
// }, 3000)
// 2.ReplaySubject：
/**
 * 某些时候，我们希望Subject代表事件的同时又能够在最新订阅的Observer上重新发送最后的几个元素，
 * ReplaySubject虽然具有上面所说的功能，但本质上与Behavior不同，它并不代表“状态”而只是对后面的事件进行重放而已
 * @param {count: number} 重访事件数
 * @param {windowTime: number}
 */
var replaySubject = new Rx.ReplaySubject(2);
// replaySubject.subscribe(observerA)
// replaySubject.next(0)
// replaySubject.next(1)
// replaySubject.next(2)
// setTimeout(() => {
//   replaySubject.subscribe(observerB)
// }, 1000)
// 3.AsyncSubject
/**
 * AsyncSubject会在subject complete的时候送出最后一个值（送出最后一个值这点跟Behavior有点像，但是Async只会在结束后送出值）
 */
var asyncSubject = new Rx.AsyncSubject();
// asyncSubject.subscribe(observerA)
// asyncSubject.next(1)
// asyncSubject.next(2)
// asyncSubject.next(3)
// asyncSubject.complete()
// setTimeout(() => {
//   asyncSubject.subscribe(observerB)
// }, 1000)

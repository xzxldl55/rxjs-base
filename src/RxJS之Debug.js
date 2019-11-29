const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
/**
 * 高度抽象的RxJS代码在排错上也会显得步履维艰
 */

// 1.do：RxJS 自带提供了一个操作符do来给我们debug，do接收一个callback，他不会对数据流产生任何影响
let oaDo = Observable.interval(1000).do(x => console.log('do: ', x)).map(x => x + 'map').do(x => console.log('do2: ', x))
oaDo.subscribe(console.log)

// 2.理清各个Observable之间的关系，从而寻找问题，eg：
/* 对于下面这个例子来说，我们实现的是一个简单的加减按钮功能，乍一看这个merge与scan很容易把我们弄蒙蔽，但只要将其关联图画出来就很容易理解了。
const addButton = document.getElementById('addButton');
const minusButton = document.getElementById('minusButton');
const state = document.getElementById('state');

const addClick = Rx.Observable.fromEvent(addButton, 'click');
const minusClick = Rx.Observable.fromEvent(minusButton, 'click');
const initialState = Rx.Observable.of(0);

const numberState = initialState
    .merge(
        addClick.mapTo(1),
        minusClick.mapTo(-1)
    )
    .scan((origin, next) => origin + next)
numberState
  .subscribe({
    next: (value) => { state.innerHTML = value;},
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
  });
*/
/*
--------------        --------------        --------------
'            '        '            '        '            '
'initialState'        '  addClcik  '        ' minusClick '
'            '        '            '        '            '
--------------        --------------        --------------
      |                     |                      |
      |                     |  mapTo(1)            | mapTo(-1)
merge | ____________________|                      |
      | \__________________________________________|
      |
     \|/
      |
      | scan((origin, next) => origin + next)
      |
     \|/
-------------
'           '
'numberState'
'           '
-------------
*/

// 3.使用弹珠图：
/*
initialState: 0|
addClick   : ----------1---------1--1-------
minusClick : -----(-1)---(-1)---------------

                      merge(...)

          : 0----(-1)-1-(-1)----1--1-------

          scan((origin, next) => origin +next)

numberState : 0----(-1)-0-(-1)----0--1-------
 */
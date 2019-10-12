const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
/**
 * 合并操作符：✨❤️
 */
let oaInterval = Observable.interval(1000).take(4)
let oaOf = Observable.of(1, 2, 3)
let oaFrom = Observable.from(['xzx', 'ldl', 'zyq'])

// 1.concatAll：有的情况下Observable送出的元素还是一个Observable（高阶Observable-Higher Order Observable），此时就像一个二维数组，concatAll即类似Array.concat将其摊平
//          注：concatAll会先处理先出现的observable，只有等到这个observable处理完毕后才会处理下一个observable，所以如果二维数组内的
//             obervable为异步的，再经过其处理后会变得整体像是同步的 --> 即可认作其组合方式为直接首尾相连接
/**
 * ----(123)----(123)----...
 */
let oaConcatAll = Observable.interval(1000).map(v => Observable.of(1, 2, 3)).concatAll()
// oaConcatAll.subscribe(console.log)

// 2.concat：将多个observable合并成一个。
//          ⚠️注意：concat合并原则与concatAll一样，都是收尾合并，所以在下面的栗子中，先是看到'concat --> '被打印，接着便是---0---1---...即oaInterval的内容，而后面的oaOf与oaFrom需要等待oaInterval的1000各数字输出完才会开始
//          🆕提示：concat也能当作一个静态方法来使用无需实例化：a = Observable.concat(oa1, oa2, oa3)
let oaConcat = Observable.of('concat --> ').concat(oaInterval, oaOf, oaFrom)
// oaConcat.subscribe(console.log)

// 3.startWith：能够在observable开始前塞入其他元素，参数为其他元素（非observable），塞入元素同步吐出 ---> 常用于保存程序的其实状态
let oaStartWith = oaInterval.startWith('start With -> ')
// oaStartWith.subscribe(console.log)

// 4.merge：功能上类同concat，亦为合并，但其合并原则却完全不同
//          👓：merge将会同时处理需要合并的多个Observable，按照它们吐出值的时间来合并并将值有序吐出（即，并非简单首尾相接了）--> 他的逻辑有点像OR
//          👓：merge同样可以当坐静态方法使用，他将会在merge的Observable都结束后结束
//          如下：
//          oaInterval: ----0----1----2----3----...
//          merge(xxx): --0--1--2--3--...
//          oaMerge:    --0--(01)--2--(13)--...
let oaMerge = oaInterval.merge(Observable.interval(500))
// oaMerge.subscribe(console.log)

// 5.combineLatest：将各个Observable的最后的值合并成一个，接收多个参数，前面n-1个为Observable，最后一个参数为callback，callback参数数量等于所需要合并的Observable数量
//                 👀：其原则为，必须等到待合并的所有Observable都有值送出的时候才会调用callback来吐出值
//                 🐂：适合多因子结果运算，每个因子都会时时变化，通过combineLatest，确保我们能够每次得到最新结果
//     如               ----0----1----2----3|
//                      --0--1--2--3|
//     combineLatest:   ----(0+0=0)(0+1=1)--(0+2=2)--(1+2=3)(1+3=4)----(2+3=5)----(3+3=6)|
/**
 * 1⃣️：o2吐出0，此时o1还没吐出过值，不执行callback
 * 2⃣️：o1吐出0，o2最后吐出值为0， --> 0
 * 3⃣️：（同时）o2吐出1，o1最后值为0， --> 1
 * 4⃣️：o2吐出2，o1最后值为0， --> 2
 * 5⃣️：o1吐出1，o2最后值为2， --> 3
 * 6⃣️：（同时）o2吐出3，o1最后值为1， --> 4
 * 7⃣️：o1吐出2，o2最后为3， --> 5
 * 8⃣️：o1吐出3，o2最后为3， --> 6
 */
let oaCombineLatest = oaInterval.combineLatest(Observable.interval(500).take(4), (x, y) => x + y)
// oaCombineLatest.subscribe(console.log)

// 6.zip：顾名思义，拉链，zip的合并原则就跟拉链一样，它会将相同位序的元素进行合并（无论时间）并传入callback。且其将在取完最少元素的Observable后结束
//        其参数跟combineLatest一样，zip很实用通常能用来将同步的数据变成异步送出：Observable.interval(100).zip(Observable.of('xzx','ldl','zyq'), (x, y) => y)即每隔100ms送出of内的一段数据，送完为止
/**
 * o1: ----0----1----2----3|
 * o2: --0--1--2|
 * zip: ----(o1[0]+o2[0]=0)----(o1[1]+o2[1]=2)----(o1[2]+o2[2]=4)|
 */
let oaZip = oaInterval.zip(Observable.interval(500).take(3), (x, y) => x + y)
// oaZip.subscribe(console.log)

// 7.withLatestFrom：与combineLatest相似，但有‘主从关系’，只有再主Observable送出值时才会执行callback，从Observable纯当背景板用来给参数的
/**
 * o1: ------0------1------2------3------4------...
 * o2: ----0----1----2----3|
 * result: ------0------'1xx'------2------...
 * 1⃣️：1.5s后o1送出0，o2上一次值为0 --> x
 * 2⃣️：3s后o1送出1，o2上一次值为1（因为先送出的是o1，它匹配的其实是2s时o2送出的值1，则在执行完后o2才送出2）--> x'xx'
 * ...以此类推
 *
 * 常用于做一些滤过的东西，如编辑器，o1就是单纯的输入文字，o2则为样式的设置，当将样式设为粗体时，输出的就是粗体，设为斜体输出的就是斜体
 */
let oaWithLatestFrom = Observable.interval(1500).withLatestFrom(oaInterval, (x, y) => y === 1 ? x+'xx' : x)
// oaWithLatestFrom.subscribe(console.log)

// 8.switch：处理高阶Observable（即二维Observable），不同于concatAll的首尾衔接，switch会在新的Observable来临的时候将上一个Observable退订（不管是否完成了）直接处理新的
/**
 * click: -----c---c-----c---...
 * map:   -----o---o-----o---...
 * switch:-------0-「来了个新的」--0--1-「来了个新的」--0--1--2--3...
 */
// let oaSwitch = Observable.fromEvent(document, 'click').map(e => Observable.interval(200)).switch()

// 9.mergeAll：跟merge原则一样，同时处理多个Observable按照吐出时间顺序来合并。同时mergeAll可以出传入一个数值代表了它能够同时处理的Observable数量，它会等前面的n个Observable处理完了再开始处理后面的
/**
 * O1: -----o-----o-----o...
 * map1: --------0---1---2|
 * map2: -------------0---1---2|
 * ...
 * res: --------0---1--0-2--1...
 *
 * 所以：mergeAll(1) ==> concatAll()
 */
let oaMergeAll = Observable.interval(500).map(e => Observable.interval(300).take(3)).mergeAll()
// oaMergeAll.subscribe(console.log)

/**
 * 🆚VS： mergeAll & concatAll & switch
 * 1⃣️mergeAll：同时处理多个Observable，按照它们吐出顺序合并
 * 2⃣️concatAll：一次只能处理一个Observable，只有等到前面那个处理完才能处理后面的，就像收银员
 * 3⃣️switch：每次只处理新的Observable，旧的丢掉，渣男类型
 */

// 10.concatMap：实际上就是map + concatAll，两个参数：第一个callback为map，第二个callback接收四个参数分别为：外部Observable送出元素，内部Observable(即map出来的)送出元素，外部Observable送出元素index，内部index
let oaConcatMap = Observable.interval(500).concatMap(e => Observable.interval(200).take(3))
// oaConcatMap.subscribe(console.log)

// 11.switchMap：即switch + map
/**
 * 这个其实也能拿来做防抖：快速发出很多个请求的时候，我们只处理最新的那个（上面那个concatMap就是一个一个排队处理，也能够防止因为HTTP返回时间不同造成的问题）
 * 接收第二个参数，resultSelect，参数跟concatMap的一样，可以再次筛选结果集
 */
let oaSwitchMap = Observable.interval(500).switchMap(v => Observable.interval(200).take(3))
// oaSwitchMap.subscribe(console.log)

// 12.mergeMap：map + mergeAll, 第二个参数跟concatMap一样。但其还有第三个参数，能够限制并行处理的数量
let oaMergeMap = Observable.interval(500).mergeMap(v => Observable.interval(200).take(4))
// oaMergeMap.subscribe(console.log)

/**
 * Tips：concatMap，mergeMap，switchMap有一个共同点，就是能够将第一个参数回传的Promise（如果是Promise的话）直接自动转换成Observable（省去了Observable.from(Promise)）
 *      在使用上：
 *      ❤️concatMap：适合用在确定了外部的Observable吐出速度不会比内部的Observable发送时间快（即不会发生重叠），不希望有任何并行处理行为，比如一次一次完成的UI动画，或者是websocket那样的心跳包
 *      ❤️mergeMap：所以咯，适合并行IO处理
 *      ❤️switchMap：只处理最后一次行为，不知道用什么就用这个
 */
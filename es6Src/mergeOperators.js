/**
 * 合并操作符：将多个Observable合并到一起的操作符，犹如众多小溪汇入江河
 *    concat：首尾合并
 *    concatAll：高阶Observable的首尾合并
 *    merge：按出现时间先后合并
 *    mergeAll：~
 *    zip：拉链一样一一对应合并
 *    zipAll：~
 *    combineLatest：合并最新出现的值
 *    combineAll：~
 *    withLatestFrom：由一个主Observable控制吐出值，被合并的Observable只贡献值（贡献最新出现的）
 *    race：竞速，赢者通吃
 *    startWith：同步加塞一些值
 *    forkJoin：RxJS界的Promise.all，合并一组Observable最终产出的值
 *    switch：切换到最新的内部Observable
 *    exhaust：在上一个被订阅的Observable完结前对新出现的Observable置之不理
 */
import {outilObserver} from './outilObserver'
import {
  oaOf$,
  oaInterval$
} from './creatOperators'
import { 
  map,
  concat,
  withLatestFrom,
  startWith,
  take,
  concatAll,
  mergeAll,
  zipAll,
  combineAll,
  switchAll,
  exhaust
} from 'rxjs/operators'
import { interval, never, merge, zip, combineLatest, timer, race, forkJoin, of } from 'rxjs'
// import {concat} from 'rxjs/observable/concat'

/**
 * 1、concat：最简单的合并，即首尾合并，有静态也有实例操作符
 * of$: (1、xzx、2)|->
 * interval: ----0----1----2|->
 * concat: (1、xzx、2)----0----1----2|->
 */
var oaConcat$ = oaOf$.pipe(concat(oaInterval$))
// var oaConcat$ = concat(oaOf$, oaInterval$) // 静态方法
// oaConcat$.subscribe(outilObserver) 

/**
 * 2、merge：先到先得，快速通过。
 *    merge会第一时间订阅上游所有的Observable，然后对上游数据采取先到先得策略，！！！“只要有任何一个Observable有数据下来，那么merge就吐出一次数据，将其转交下游”
 *  如下面例子的弹珠图
 *  i1: --0--1--2...->
 *  i1Map: --0A--1A--2A...->
 * 
 *  i2: ----0----1----2...->
 *  i2Map: ----0B----1B----2B...->
 * 
 *  merge: --0A--(0B & 1A)--2A--(1B & 3A)--4A--(2B & 5A)...->
 * 
 *  - Merge的同步限流，merge可以接收一个可选参数，用来表示合并的Observable数量，如下：
 *  o1 = interval(500).take(3)
 *  o2 = interval(600)
 *  o3 = interval(800)
 *  source$ = o1.pipe(merge(o2, o3, 2))
 *  我们指定合并数量为2，此时o3将不会得到进入merge的机会，只有当o1的数据流处理结束后，才会轮到o3
 * 
 *  - 应用场景：如许多事件可以使用同一个处理函数的情况，比如DOM的touchend与click事件，我们就可以
 *  merge(
 *    fromEvent(element, 'click'),
 *    fromEvent(element, 'touchend')
 *  ).subscribe(handler)
 *  这样无论触发的是哪个我们都使用同一个方法来处理了。
 */
var oaMerge$ = merge(
  interval(500).pipe(map(v => v + 'A')),
  interval(1000).pipe(map(v => v + 'B'))
)
// oaMerge$.subscribe(outilObserver)

/**
 * 3、Zip：顾名思义，就像拉链一样进行组合，一对一对的卡合住。在异步数据流的情况下，zip接收到一个数据而另一个数据还未出现时，会进行等待，等到其出现后再进行组合
 * 例如下面的：
 * of: (1, xzx, 2)|->
 * interval: ----Zip----Zip----Zip...->
 * Zip: ----[1, Zip]----[xzx, Zip]----[2, Zip]|->
 * 
 * Zip也支持多条Observable的合并，他的数量就像木桶短板理论一样由最短的板子（最短的Observable决定）
 */
var oaZip$ = zip(
  oaOf$,
  interval(1000).pipe(map(v => 'Zip'))
)
// oaZip$.subscribe(outilObserver)

/**
 * 4、combineLatest：将各个Observable的最后的值合并成一个，接收多个参数，前面n-1个为Observable，最后一个参数为callback，callback参数数量等于所需要合并的Observable数量
 *      👀：其原则为，必须等到待合并的所有Observable都有值送出的时候才会调用callback来吐出值
 *      🐂：适合多因子结果运算，每个因子都会时时变化，通过combineLatest，确保我们能够每次得到最新结果
 * 
 * 如下的步骤图为：
 * 1⃣️：o2吐出0，此时o1还没吐出过值，不执行callback
 * 2⃣️：o1吐出0，o2最后吐出值为0， --> 0
 * 3⃣️：（同时）o2吐出1，o1最后值为0， --> 1
 * 4⃣️：o2吐出2，o1最后值为0， --> 2
 * 5⃣️：o1吐出1，o2最后值为2， --> 3
 * 6⃣️：（同时）o2吐出3，o1最后值为1， --> 4
 * 7⃣️：o1吐出2，o2最后为3， --> 5
 * 8⃣️：o1吐出3，o2最后为3， --> 6
 * 
 * 弹珠图：
 * 如               ----0----1----2----3|
 *                  --0--1--2--3|
 * combineLatest:   ----(0+0=0)(0+1=1)--(0+2=2)--(1+2=3)(1+3=4)----(2+3=5)----(3+3=6)|
 * 
 * - CombineLatest会在所有OBservable都完结后才会完结
 * - 再进行同步Observable时，将会提取第一个Observable的最后值与其他Observable的值进行组合
 *    这是因为Combine会顺序订阅所有上游Observable，但在它订阅第一个Observable时（O1），O1就已经吐出了全部数据了，所以再订阅后面的O时，就将触发合并吐出机制（只有两个O的情况下，n个O的话将会取前n-1个O的最末尾值，与第n个O的所有值匹配）
 * 
 * - 小缺陷（glitch）：当出现多重依赖问题时
 *    如，两个O其实是依赖于同一个O的，
 *    eg：O = interval(1000); O1 = O.map(v => v + 'a'); O2 = O.map(v => v + 'b')
 *      combineLatest(O1, O2)
 *    此时将会得到：[0a, 0b], [1a, 0b], [1a, 1b]......
 *    这里就有一个问题在FRP的原旨定义上，这种依赖于同一个O的情况，吐出值应该只和O有关，不应该出现以上的情况，应该是
 *       [0a, 0b],[1a, 1b]...
 *    面对这个问题我们使用withLastestFrom就能得到上面的输出
 */
var oaCombineLatest = combineLatest(interval(1000), interval(500), (o1, o2) => `o1: ${o1} -- o2: ${o2}`)
// oaCombineLatest.subscribe(outilObserver)

/**
 * 5、withLastestFrom：功能类似于他的兄弟combineLastest，但是❤ 它给下游推送数据只能由一个上游Observable来控制（调用withLastestFrom操作符的实例） ❤
 *    所以它也只有实例化操作符，调用者决定是否吐出数据，参数只负责贡献数据了。
 *  
 *  如下面的操作，将吐出 101，203，305...
 *  弹珠图： O1$: 0----100----200----...
 *          O2$: -0--1--2--3--4--5--...
 * 
 *    解析：
 *      ① O1吐出0时，O2还没数据，所以并未触发Project
 *      ② O2吐出0，但是O2没有控制权，所以也没触发project吐出数据
 *      ③ O2吐出1
 *      ④ O1吐出100，O2此时最后的值为1，触发project组合未 101
 *      ...
 */
var O1$ = timer(0, 2000).pipe(map(v => v * 100))
var O2$ = timer(500, 1000)
var oaWithLastestFrom = O1$.pipe(withLatestFrom(O2$, (a, b) => a + b))
// oaWithLastestFrom.subscribe(outilObserver)

/**
 * 6、race：顾名思义，竞速！多个Observable在一起，看谁最先产生数据，胜者通吃，败者失去所有机会，race将会全盘采用胜者的数据流，退订败者的。
 *    下面的例子A最先吐出数据，所以最终结果取A：A0、A1、A2...
 */
var oaRace = race(timer(0, 2000).pipe(map(v => 'A' + v)), timer(500, 500).pipe(map(v => 'B' + v)), timer(50, 100).pipe(map(v => 'C' + v)))
// oaRace.subscribe(outilObserver)

/**
 * 7、startWith：也只有实例操作符的形式，功能是让一个Observable对象在订阅时，总是先（同步）吐出指定的若干个数据 ===> 等于说加塞一些数据在Observable前面
 *    不足之处是他的所有加塞数据只能是同步吐出的，想要异步的话咱还得用concat
 */
var oaStartWith = interval(1000).pipe(startWith('xzx', 'ldl', 'zyq'))
// oaStartWith.subscribe(outilObserver)

/**
 * 8、forkJoin：只有静态操作符。
 *    forkJoin接收多个Observable，当这些Observable全部结束后，将他们的最后一个值合并发送到下游。
 *    类似于RxJS界的Promise.all
 * 
 * 下面的例子：
 * interval: --0--1--2--3--4|->
 * timer: --0----1----2----3----4----5|->
 * of: '1' & 'xzx' & '2'|->
 * 
 * forkJoin: ----------------------[4, 5, '2']|->
 */
var oaForkJoin = forkJoin(
  interval(500).pipe(take(5)),
  timer(500, 1000).pipe(take(6)),
  oaOf$
)
// oaForkJoin.subscribe(outilObserver)




//  -------------------------------------------------------------------------------高阶Observable----------------------------------------------------------------------------
/**
 * 高阶Observable：
 *    定义：即吐出的数据内容依然是Observable的Observable
 *    - 高阶Observable产出的数据也叫“内部Observable”，因为他们一般也不展示在外。
 *    - 高阶Observable的完结不代表其内部Observable的完结，内部Observable有着自己的生命周期。
 * 
 *    意义：
 *    - 能够用Observable来管理多个Observable对象。
 *    - 它的本质就是用管理数据的方式来管理多个Observable对象。
 * 
 *    合并类高阶操作符功能各有差异，但都是将一个高阶Observable的内部Observable组合起来，且所有这些操作符都只有实例化操作符的形式
 */   

 /**
  * 9、concatAll：与concat首尾组合的功能一样，但是它只有一个上游Observable是一个高阶Observable
  *   
  * 下面的例子，对interval(1000)，依次使用三个实例操作符：
  *    - take(2)：取前两次的值：0,1
  *    - map：转化值为产生一个新的Observable -> interval(500) ==> 并对该内部Observable过滤操作，只取前三个值0,1,2，并将值转化为 x : y形式。
  *    - concatAall：即组合内部Observable，且concatAll为首尾组合，所以会先订阅第一个内部Observable即0:0, 0:1, 0:2，再订阅第二个内部Observable
  * 
  *   高阶O： ----O1----O2|->
  *               |     |
  *   O1          --0:0--0:1--0:2|->
  *                     |
  *   O2                --1:0--1:1--1:2|->
  *concatAll:------0:0--0:1--0:2--1:0--1:1--1:2|->
  *  
  * 高阶Observable数据积压问题：
  *     在下面的例子中，能够看到高阶Observable以1s一个的时间间隔来产生Observable，而内部Observable产生完整的对象需要1.5s，
  *     这样我们concatAll对于内部Observable的消化速度将追不上外部的高阶Observable产生内部Observable的速度，在本例中我们使用了take来过滤出两个并未出现问题
  *     但当内部Observable的数量越来越多时，将会产生Observable的积压（消耗速度低于生产速度），如此将会导致出现内存溢出问题memory leak
  */
var oaConcatAll$ = interval(1000).pipe(take(2), map(x => interval(500).pipe(take(3), map(y => x + ':' + y))), concatAll())
// oaConcatAll$.subscribe(outilObserver)

/**
 * 10、mergeAll：先到先得处理内部Observable，mergeAll只要发现上游高阶Observable产生一个内部Observable就会立刻订阅这个内部Observable，而不像concatAll一样需要等待上一个内部Observable的消化完结
 * 
 * 高阶O： ----O1----O2|->
 *             |     |
 *   O1        --0:0--0:1--0:2|->
 *                   |
 *   O2              --1:0--1:1--1:2|->
 * Merge: ------0:0--0:1--1:0 & 0:2--1:1--1:2|->
 * 
 * - Tips：这里我们能够观测到一个有趣的现象，O1的数据[0:2]与O2的数据[1:0]是同一时间被吐出的，但MergeAll选择先将[1:0]吐出，再将[0:2]吐出，
 * 如此能够知道MergeAll在对同一时间吐出数据处理是，以最近订阅的内部Observable为优先！
 */
var oaMergeAll$ = interval(1000).pipe(take(2), map(x => interval(500).pipe(take(3), map(y => x + ':' + y + '+' + Date.now()))), mergeAll())
// oaMergeAll$.subscribe(outilObserver)

/**
 * 11、zipAll：就拉链一样成对合并就完了
 * 
 * ----------[ '0:0+1589701648782', '1:0+1589701648782' ]--[ '0:1+1589701649286', '1:1+1589701649286' ]--[ '0:1+1589701649286', '1:1+1589701649286' ]
 * 从上面的弹珠图我们能够看到，一组被组合到一起的数据，他的吐出时间是一致的！
 * 这就很奇怪，因为其内部Observable并非是同一时间创建的。
 * 所以这就是ZipAll的特性，他会等到上游Observable吐出所有的内部Observable才会开始他的一一配对工作工作，
 * 如此对于zipAll来说，他其实是在同一时间对上面的两个内部Observable进行订阅的，所以出现了其时间一致的现象。
 */
var oaZipAll$ = interval(1000).pipe(take(2), map(x => interval(500).pipe(take(3), map(y => x + ':' + y + '+' + Date.now()))), zipAll())
// oaZipAll$.subscribe(outilObserver)

/**
 * 12、combineAll：跟zipAll一样只有上游的高阶Observable完结了才会开始工作的，并对吐出值进行最后一个值（最近吐出的值）的合并
 */
var oaCombineAll$ = interval(1000).pipe(take(2), map(x => interval(500).pipe(take(3), map(y => x + ':' + y + '+' + Date.now()))), combineAll())
// oaCombineAll$.subscribe(outilObserver)

/**
 * 13、switchAll：喜新厌旧操作符。它总是会切换到“最新的”内部Observable，每当上游高阶Observable吐出一个新的内部Observable，switch就会抛弃（退订）上一个旧的内部Observable，而订阅这个新的内部Observable
 * 高阶O： ----O1----O2|->
 *             |     |
 *   O1        --0:0--0:1--0:2|->
 *                   |
 *   O2              --1:0--1:1--1:2|->
 * switch:------0:0--1:0（这里在8个 - 后高阶O吐出了O2，所以立刻退订了O1，而订阅O2）--1:1--1:2|->
 * 
 * 所以，有一点需要注意区分的是，switchAll对旧的进行退订时间是新的内部O出现的时间，而不是新的内部O开始吐出数据的时间哦！
 * - 对于switchAll的完结有两个条件：
 *  - 高阶Observable完结
 *  - 内部Observable完结
 */
var oaSwtich$ = interval(1000).pipe(take(2), map(x => interval(500).pipe(take(3), map(y => x + ':' + y + '+' + Date.now()))), switchAll())
// oaSwtich$.subscribe(outilObserver)

/**
 * 14、exhaust：耗尽！他的功能即其意思，在耗尽上一个内部Observable之前不会切换到下一个Observable（且如果下一个Observable的出现时，上一个被订阅的内部Observable还没完结，那么它将被舍弃）！
 * 高阶O： ----O1----O2|->
 *             |     |
 *   O1        --0:0--0:1--0:2|->
 *                   |(这里O2出现了，但是由于O1仍然未结束，所以O2被舍弃了！)
 *   O2              --1:0--1:1--1:2|->
 * exhaust:------0:0--0:1--0:2|->
 */
var oaExhaust$ = interval(1000).pipe(take(2), map(x => interval(500).pipe(take(3), map(y => x + ':' + y + '+' + Date.now()))), exhaust())
// oaExhaust$.subscribe(outilObserver)


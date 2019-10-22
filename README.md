# rxjs🐂🍺base

## 弹珠图：
- 规则：
  - `-`：小段时间
  - `X`：错误
  - `|`：observable结束
  - `()`：代表同步发生
  - eg:
	```
	// Rx.Observable.interval(1000):
	----0----1----2----3----...
	// Rx.Observable.of(1,2,3,4)
	(1234)|
	```

## Observable特性：
- 渐进式取值：每次都只处理一个Observable流
- 延迟运算：订阅之后才会进行运算
- Observer Pattern && Iterator Pattern两种模式思想的结合，具备生产者推送资料，又同时能够像一个Iterator序列一样拥有处理序列的方法（Map, filter, reduce...）

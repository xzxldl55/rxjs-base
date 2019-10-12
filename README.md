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

## 特性：
- 渐进式取值：每次都只处理一个Observable流
- 延迟运算：订阅之后才会进行运算

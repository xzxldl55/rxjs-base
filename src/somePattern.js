// Observer Pattern --> Product生产者推送信息
class Product {
    constructor() {
        this.listeners = []
    }
    addListener (listener) {
        if (typeof listener === 'function')
            this.listeners.push(listener)
        else
            throw new Error('Listener 必须是一个Func')
    }
    removeListener (listener) {
        this.listeners.splice(this.listeners.indexOf, 1)
    }
    notify (message) {
        this.listeners.forEach(listener => listener(message))
    }
}
let Pro1 = new Product()
Pro1.addListener((message) => console.log(message))
Pro1.addListener((message) => console.log(message + 'w'))
Pro1.addListener((message) => console.log(message + 'z'))

Pro1.notify('xzxldl')

// Iterator Pattern --> Consumer消费者索取信息
class IteratorFromArr {
    constructor (arr, cursor = 0) {
        this._arr = arr
        this._cursor = cursor
    }
    next () {
        return (this._cursor >= this._arr.length) ? ({ done: true }) : ({ value: this._arr[this._cursor++], done: false })
    }
    map (callback) {
        const _iterator = new IteratorFromArr(this._arr, this._cursor)
        _iterator._arr = _iterator._arr.map(v => callback(v))
        return _iterator
    }
}

let testIterator = (new IteratorFromArr([0, 1, 2, 3])).map(v => v * v)
console.log(testIterator.next())
console.log(testIterator.next())
console.log(testIterator.next())
console.log(testIterator.next())
console.log(testIterator.next())

// Lazy Evaluation --> 同消费者索取信息
function* getNumbers (words) {
    for (const word of words) {
        if (/^[0-9]+$/.test(word)) {
            yield parseInt(word, 10) // next()才会向下运行下去
        }
    }
}
const iterator = getNumbers('你就是个250，你4不4傻？')
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

/**
 * Obervable即为此二种方式的结合，其具备生产者推送特性的同时，能够产生消息序列，对其使用map，filter等方法修饰
 */
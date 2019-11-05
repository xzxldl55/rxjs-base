let a = {
    [Symbol.toPromitive]: function(hint) {
        let i = 1
        // 整个闭包，i不会被收回
        return function() {
            return i++
        }
    }
}
console.log(a+1)

let b = new Proxy({}, {
    i: 1,
    get: function() {
        return () => this.i++
    }
})
console.log(b == 1 , b == 2 , b == 3)

let c = [1, 2, 3]
c.join = c.shift // shift将会删除数组第一个元素并将其返回
console.log(c == 1 , c == 2 , c == 3)
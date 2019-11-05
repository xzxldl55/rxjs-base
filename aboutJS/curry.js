const curry = (fn, ...args) => {
    console.log(args, fn.length)
    return (
        fn.length > args.length
            // 若传入参数不够则返回一个函数，接收任意参数并将已接收参数与后来要接收参数一并传入curry再次做判断
            ? (...arguments) => curry(fn, ...args, ...arguments)
            // 直到参数个数满足函数要求则直接执行函数
            : fn(...args)
    )
}

const sum = (a, b, c) => {
    return a + b + c
}

const cs = curry(sum)

cs(2)(3)(5)
cs(2, 3, 5)
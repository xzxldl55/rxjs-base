// class Publisher {
//   constructor () {
//     this.subscribers = {}
//   }
//   listen(type, callback) {
//     if (!this.subscribers[type]) {
//       this.subscribers[type] = []
//     }
//     this.subscribers[type].push(callback)
//   }
//   remove(type, callback) {
//     if (!callback) {
//       this.subscribers[type] = []
//     } else {
//       this.subscribers[type].splice(this.subscribers[type].indexOf(callback), 1)
//     }
//   }
//   notify(type, ...args) {
//     if (!this.subscribers[type]) {
//       return false
//     }
//     this.subscribers[type].forEach(callback => {
//       callback(args)
//     })
//   }
// }

// let School = new Publisher()

// School.listen('数学课', function (info) {
//   console.log('我是小明，我只上数学课', info)
// })
// School.listen('语文课', function (info) {
//   console.log('我是小红，我语文数学都上', info)
// })
// School.listen('数学课', function (info) {
//   console.log('我是小红，我语文课数学课都上', info)
// })

// School.notify('语文课', '今天讲《沁园春.雪》')
// setTimeout(() => {
//   School.notify('数学课', '今天讲解析几何')
// }, 4500)


// 深拷贝
function deepCopy (obj, hash = new WeakMap()) { // 使用递归层层深入每一个Object，然后将其值返回到上一层的t[key]内，再最终返回到最上层的t内再返回t
  if (obj instanceof RegExp) return new RegExp(obj) // Reg与Date直接构造对应类型返回
  if (obj instanceof Date) return new Date(obj)
  if (typeof(obj) === null || typeof(obj) !== 'object') return obj // 非复杂类型，直接返回
  if (hash.has(obj)) return hash.get(obj) // 如果是个空对象则返回空对象
  
  let t = new obj.constructor() // 最上层的t将是我们最终return的，其内部的Object，将在下面的for in循环内被深层遍历，然后作为t[key]被返回进去
  hash.set(obj, t)
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          t[key] = deepCopy(obj[key], hash)
      }
  }
  return t
}

let obj = {
  'time': new Date(),
  'complex': {
    'RegExp': new RegExp(/^ab+/),
    'array': [0, 1, 2]
  },
  'num': 1,
  'str': 'xzxldl55'
}
console.log(deepCopy(obj))

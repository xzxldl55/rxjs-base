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
// 1.原型继承
function SuperClass(name = 'xzxldl') {
  this.name = name
}
SuperClass.prototype.getName = function () {
  return this.name
}

function SubClass(age) {
  this.age = age
}
// 这里将子类的原型变成了父类的实例，所以原型中有父类中的属性与方法
SubClass.prototype = new SuperClass()
SubClass.prototype.getAge = function () {
  return this.age
}

// 1.存在问题，无法让每个子实例给父类传递参数
let sub = new SubClass(12)
let sub2 = new SubClass(13)
// 2.sub与sub2会共享一个this.name因为它存在SubClass的原型中，所以该继承方法存在弊端
// console.log(sub.getName(), sub.getAge(), sub2.getName(), sub2.getAge())

// 2.借用构造函数：即使用call等方法借用父类的构造函数，在子类构造函数内执行，并传入参数，这样就解决了无法给父类传参的问题
function Father(name) {
  this.name = name
}

function Son(name) {
  // 借用Father构造函数，并把Son的this传入取代了。
  Father.call(this, name)
  // 存在的问题是无法继承到父类的方法了
}

let son1 = new Son('Shelley')
let son2 = new Son('Alice')
// console.log(son1.name, son2.name)


// 3.组合模式：
function High(name) {
  this.name = name
}
High.prototype.getName = function () {
  return this.name
}

function Low(name, age) {
  High.call(this, name)
  this.age = age
}
Low.prototype = new High()
Low.prototype.constructor = Low // 扭转回Low原型指向的构造方法
Low.prototype.getAge = function () {
  return this.age
}

let low1 = new Low('Jerry', 12)
let low2 = new Low('Tom', 3)
// console.log(low1, low2)

let FatherObject = {
  name: 'Jenniffer',
  age: 18
}
let SonObject = Object.create(FatherObject)
SonObject.age = 19
SonObject.name = 'Jerry'
FatherObject.name = 'Tom'
console.log(FatherObject, SonObject)

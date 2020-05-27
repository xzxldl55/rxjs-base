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




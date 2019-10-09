Array.prototype.map = function (callback) {
	let ret = [] // pure function
	this.forEach(function (v, i) {
		ret.push(callback(v, i))
	})
	return ret
}
// Filter
Array.prototype.filter = function (callback) {
	let ret = []
	this.forEach(function (v, i) {
		if (callback(v, i))
			ret.push(v)
	})
	return ret
}
// concatAll
Array.prototype.concat = function () {
	let ret = []
	this.forEach(array => {
		ret.push.apply(ret, array)
	})
	return ret
}
// function findArr (currentIndex, targetArr) {
// 	targetArr.forEach(v => {
// 		if (v === currentIndex)
// 			return true
// 	})
// 	return false
// }

var courseLists = [{
	"name": "My Courses",
	"courses": [{
		"id": 511019,
		"title": "React for Beginners",
		"covers": [{
			width: 150,
			height: 200,
			url: "http://placeimg.com/150/200/tech"
		}, {
			width: 200,
			height: 200,
			url: "http://placeimg.com/200/200/tech"
		}, {
			width: 300,
			height: 200,
			url: "http://placeimg.com/300/200/tech"
		}],
		"tags": [{
			id: 1,
			name: "JavaScript"
		}],
		"rating": 5
	}, {
		"id": 511020,
		"title": "Front-End automat workflow",
		"covers": [{
			width: 150,
			height: 200,
			url: "http://placeimg.com/150/200/arch"
		}, {
			width: 200,
			height: 200,
			url: "http://placeimg.com/200/200/arch"
		}, {
			width: 300,
			height: 200,
			url: "http://placeimg.com/300/200/arch"
		}],
		"tags": [{
			"id": 2,
			"name": "gulp"
		}, {
			"id": 3,
			"name": "webpack"
		}],
		"rating": 5
	}]
}, {
	"name": "New Release",
	"courses": [{
		"id": 511022,
		"title": "Vue2 for Beginners",
		"covers": [{
			width: 150,
			height: 200,
			url: "http://placeimg.com/150/200/nature"
		}, {
			width: 200,
			height: 200,
			url: "http://placeimg.com/200/200/nature"
		}, {
			width: 300,
			height: 200,
			url: "http://placeimg.com/300/200/nature"
		}],
		"tags": [{
			id: 1,
			name: "JavaScript"
		}],
		"rating": 5
	}, {
		"id": 511023,
		"title": "Angular2 for Beginners",
		"covers": [{
			width: 150,
			height: 200,
			url: "http://placeimg.com/150/200/people"
		}, {
			width: 200,
			height: 200,
			url: "http://placeimg.com/200/200/people"
		}, {
			width: 300,
			height: 200,
			url: "http://placeimg.com/300/200/people"
		}],
		"tags": [{
			id: 1,
			name: "JavaScript"
		}],
		"rating": 5
	}]
}];
var targetArr = [511019, 511022]
var result = courseLists.map((v, i) => v.courses).concat().filter((v, i) => targetArr.includes(v.id)).map(v => {
	return {
		id: v.id,
		title: v.title,
		covers: v.covers.filter(v => v.width === 150).map(v => v.url).join('')
	}
})
console.log(result)
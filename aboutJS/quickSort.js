const quickSort = function (arr) {
    const length = arr.length
    if (length <= 1) return arr
    const midIndex = Math.floor(length / 2)
    const midValue = arr.splice(midIndex, 1)

    const leftArr = []
    const rightArr = []
    arr.forEach(v => {
        if (v < midValue) leftArr.push(v)
        else rightArr.push(v)
    })
    // 递归左右，然后最后合并
    return quickSort(leftArr).concat(midValue, quickSort(rightArr))
}

// console.log(quickSort([5, 3, 1, 2, 4]))

const binarySearch = function (arr, key) {
    let low = 0
    let high = arr.length - 1
    let mid
    while (low <= high) {
        mid = Math.floor((low + high) / 2)
        if (arr[mid] === key) {
            return mid
        } else if (arr[mid] > key) { // 说明mid在low~mid之间，且不包括mid
            high = mid - 1
        } else {
            low = mid + 1
        }
    }
    return -1
}
console.log(binarySearch([1,2,3,4,5], 4))
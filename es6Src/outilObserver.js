// 工具人Observer
const outilObserver = {
  next: v => console.log(v),
  error: err => console.error(err),
  complete: () => console.log('Over!')
}

export { outilObserver }
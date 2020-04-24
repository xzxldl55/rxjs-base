import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'

// 扩展map
Observable.prototype.map = function (func) {
  return new Observable(observer => {
    const sub = this.subscribe({
      next: v => observer.next(func(v)),
      error: error => observer.error(error),
      complete: () => observer.complete()
    })
    return {
      unsubscribe: () => sub.unsubscribe()
    }
  })
}

Observable.of(1,2,3).map(v => v * 2).subscribe(console.log)
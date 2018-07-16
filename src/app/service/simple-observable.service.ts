import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class MyObserver {
  next(value) {
    console.log('next', value);
  }
  error(e) {
    console.log('error', e);
  }
  complete() {
    console.log('complete');
  }
}

@Injectable({
  providedIn: 'root'
})
export class SimpleObservableService {
  constructor() {
    let numbers = [10, 31, 42];
    //let source = Observable.create((observer) => {
    //  for (let n of numbers) {
    //    if (n === 31) {
    //      observer.error('Deu ruim!');
    //    }
    //    observer.next(n);
    //  }
    //  observer.complete();
    //});

    let source = from(numbers)
      .pipe(filter((value) => value > 30))
      .pipe(map((value) => value * 2));
    source.subscribe(
      (value) => console.log('next', value),
      (e) => console.log('error', e),
      () => console.log('complete')
    );
    
  }
}

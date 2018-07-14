import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export class MyObserver implements Observer<number> {
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
    let source = Observable.create((observer) => {
      for (let n of numbers) {
        observer.next(n);
      }
    });
    source.subscribe(new MyObserver());
  }
}

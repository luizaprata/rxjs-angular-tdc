import { Injectable } from '@angular/core';
import { from, Observer } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

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
    const numbers = [10, 31, 42];
    const source = Observable.create((observer) => {
      for (const n of numbers) {
        if (n === 42) {
          observer.error('Deu ruim!');
        }
        observer.next(n);
      }
      observer.complete();
    });
    source
      .pipe(filter((value) => value > 30))
      .pipe(map((value: number) => value * 2));

    source.subscribe(
      (value) => console.log('next', value),
      (e) => console.log('error', e),
      () => console.log('complete')
    );

    const source2 = from(numbers);
    source2
      .pipe(filter((value) => value > 30))
      .pipe(map((value: number) => value * 2));

    source2.subscribe(
      (value) => console.log('next', value),
      (e) => console.log('error', e),
      () => console.log('complete')
    );
  }
}

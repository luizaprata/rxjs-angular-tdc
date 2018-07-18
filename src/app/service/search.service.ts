import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, tap, retryWhen, scan, takeWhile, delay } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import SearchItem from '../model/SearchItem';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable()
export class SearchService {
  api: string = 'https://itunes.apple.com/search';
  results: SearchItem[];
  
  

  constructor(private http: Http) {
    this.results = [];
  }
  
  logCount: number = 0;

  logTerm = new ReplaySubject<string>(5);
  lastTerm = new BehaviorSubject<string>('');
  
  addLog(msg) {
    let count = this.logCount++;
    this.logTerm.next(`[${count}] ${msg}`);
    this.lastTerm.next(`[${count}] ${msg}`);
  }

  retryStrategy(term) {
    let _self = this;
    return function(error) {
      return error
        .pipe(scan((acc, value) => {
          _self.addLog(`${term} : tentativa ${acc}`)
          return acc + 1;
        }, 0))
        .pipe(takeWhile((acc) => acc < 3))
        .pipe(delay(1500));
    };
  }

  search(term: string): Observable<SearchItem[]> {
    const url = `${this.api}?term=${term}&media=music`;
    this.addLog(`${term} : inicia request`)
    return this.http
      .get(url)
      .pipe(tap((_)=> this.addLog(`${term} : sucesso`)))
      .pipe(map((res) => 
        res.json().results.map((item) => 
          new SearchItem(item))
      ))
      .pipe(retryWhen(this.retryStrategy(term)));
  }
}

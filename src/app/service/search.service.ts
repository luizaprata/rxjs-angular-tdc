import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, tap, retryWhen, scan, takeWhile, delay } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import SearchItem from '../model/SearchItem';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable()
export class SearchService {
  apiRoot: string = 'https://itunes.apple.com/search';
  results: SearchItem[];
  logTerm = new ReplaySubject<string>(20);
  lastTerm = new BehaviorSubject<string>('');

  constructor(private http: Http) {
    this.results = [];
  }

  retryStrategy(term) {
    let _self = this;
    return function(error) {
      return error
        .pipe(
          scan((acc, value) => {
            _self.addLog(`${term} : falhou tentativa ${acc + 1} de 3`);
            return acc + 1;
          }, 0)
        )
        .pipe(takeWhile((acc) => acc < 3))
        .pipe(delay(1500));
    };
  }

  addLog(msg) {
    this.logTerm.next(msg);
    this.lastTerm.next(msg);
  }

  search(term: string): Observable<SearchItem[]> {
    const apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
    this.addLog(`${term} : start request`);
    return this.http
      .get(apiURL)
      .pipe(tap((_) => this.addLog(`${term} : ok`)))
      .pipe(
        map((res) =>
          res.json().results.map((item) => {
            return new SearchItem(
              item.trackName,
              item.artistName,
              item.trackViewUrl,
              item.artworkUrl30,
              item.artistId
            );
          })
        )
      )
      .pipe(retryWhen(this.retryStrategy(term)));
  }
}

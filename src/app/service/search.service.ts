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
  logCount: number = 0;

  constructor(private http: Http) {
    this.results = [];
  }

  lastTerm = new BehaviorSubject<string>('');
  logTerm = new ReplaySubject<string>(20);

  addLog(msg) {
    this.lastTerm.next(msg);
    this.logTerm.next(msg);
  }

  search(term: string): Observable<SearchItem[]> {
    const _self = this;
    const url = `${this.apiRoot}?term=${term}&media=music&limit=20`;
    this.addLog(`"${term}" | inicia request`);
    return this.http
      .get(url)
      .pipe(tap((_) => this.addLog(`"${term}" | status: 200`)))
      .pipe(
        map((res) => {
          return res.json().results.map((item) => {
            return new SearchItem(
              item.trackName,
              item.artistName,
              item.trackViewUrl,
              item.artworkUrl30,
              item.artistId
            );
          });
        })
      )
      .pipe(
        retryWhen((error) => {
          const attempts = 3;
          return error
            .pipe(
              scan((acc, value) => {
                _self.addLog(
                  `"${term}" | nova tentativa ${acc + 1} de ${attempts}`
                );
                return acc + 1;
              }, 0)
            )
            .pipe(takeWhile((acc) => acc < attempts))
            .pipe(delay(1500));
        })
      );
  }
}

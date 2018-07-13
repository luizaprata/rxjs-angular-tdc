import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap
} from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../service/search.service';
import SearchItem from '../../model/SearchItem';

@Component({
  selector: 'app-search-entry',
  templateUrl: './search-entry.component.html',
  styleUrls: ['./search-entry.component.css']
})
export class SearchEntryComponent implements OnInit {
  private loading: boolean = false;
  private results: Observable<SearchItem[]>;
  private searchField: FormControl;

  constructor(private itunes: SearchService) {}

  ngOnInit() {
    this.searchField = new FormControl();
    this.results = this.searchField.valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(tap((_) => this.loading = true))
      .pipe(switchMap((term) => this.itunes.search(term)))
      .pipe(tap((_) => this.loading = false));
  }
}

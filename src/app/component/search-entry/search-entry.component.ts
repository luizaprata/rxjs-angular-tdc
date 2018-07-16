import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  filter
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
  private showLogRequests: boolean = false;
  private logRequestsText: string;
  private logSubscription;

  private showStatusRequests: boolean = false;
  private statusRequests: string;
  private statusSubscription;

  constructor(private itunes: SearchService) {
    this.setLog();
    this.setStatus();
  }

  onStatusRequests() {
    this.showStatusRequests = !this.showStatusRequests;
    this.setStatus();
    this.statusSubscription = this.itunes.lastTerm.subscribe(
      this.addStatus.bind(this)
    );
  }
  addStatus(log) {
    this.statusRequests = log;
  }
  setStatus() {
    if (this.logSubscription) this.logSubscription.unsubscribe();
    this.statusRequests = '';
  }

  setLog() {
    if (this.logSubscription) this.logSubscription.unsubscribe();
    this.logRequestsText = '';
  }
  addLog(log) {
    this.logRequestsText = `${log}\n${this.logRequestsText}`;
  }
  onLogRequests() {
    this.showLogRequests = !this.showLogRequests;
    this.setLog();
    this.logSubscription = this.itunes.logTerm.subscribe(
      this.addLog.bind(this)
    );
  }

  ngOnInit() {
    this.searchField = new FormControl();
    this.results = this.searchField.valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(tap((_) => (this.loading = true)))
      .pipe(switchMap((term) => this.itunes.search(term)))
      .pipe(tap((_) => (this.loading = false)));
  }
}

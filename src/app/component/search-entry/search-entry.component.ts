import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-search-entry',
  templateUrl: './search-entry.component.html',
  styleUrls: ['./search-entry.component.css']
})
export class SearchEntryComponent implements OnInit {
  private loading: boolean = false;

  constructor(private itunes: SearchService) {}

  doSearch(term: string) {
    this.loading = true;
    this.itunes.search(term).then(_ => (this.loading = false));
  }
  ngOnInit() {}
}

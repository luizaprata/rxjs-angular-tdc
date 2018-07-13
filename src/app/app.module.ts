import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchEntryComponent } from './component/search-entry/search-entry.component';
import { SearchService } from 'src/app/service/search.service';
import { JsonpModule, HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SearchEntryComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    JsonpModule,
    HttpModule
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule {}

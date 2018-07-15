import { Component } from '@angular/core';
import { SimpleObservableService } from './service/simple-observable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private simpleObservable: SimpleObservableService){
    
  }
}

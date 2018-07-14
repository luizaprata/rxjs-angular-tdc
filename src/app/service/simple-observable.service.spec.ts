import { TestBed, inject } from '@angular/core/testing';

import { SimpleObservableService } from './simple-observable.service';

describe('SimpleObservableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimpleObservableService]
    });
  });

  it('should be created', inject([SimpleObservableService], (service: SimpleObservableService) => {
    expect(service).toBeTruthy();
  }));
});

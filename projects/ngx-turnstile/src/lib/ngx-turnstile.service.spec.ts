import { TestBed } from '@angular/core/testing';

import { NgxTurnstileService } from './ngx-turnstile.service';

describe('NgxTurnstileService', () => {
  let service: NgxTurnstileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTurnstileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

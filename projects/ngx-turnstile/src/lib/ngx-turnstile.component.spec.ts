import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTurnstileComponent } from './ngx-turnstile.component';

describe('NgxTurnstileComponent', () => {
  let component: NgxTurnstileComponent;
  let fixture: ComponentFixture<NgxTurnstileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxTurnstileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTurnstileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

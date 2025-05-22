import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoEventsComponent } from './lotto-events.component';

describe('LottoEventsComponent', () => {
  let component: LottoEventsComponent;
  let fixture: ComponentFixture<LottoEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LottoEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LottoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

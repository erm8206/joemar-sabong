import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoAllBetsComponent } from './lotto-all-bets.component';

describe('LottoAllBetsComponent', () => {
  let component: LottoAllBetsComponent;
  let fixture: ComponentFixture<LottoAllBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LottoAllBetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LottoAllBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

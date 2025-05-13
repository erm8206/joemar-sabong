import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoReceiptsComponent } from './lotto-receipts.component';

describe('LottoReceiptsComponent', () => {
  let component: LottoReceiptsComponent;
  let fixture: ComponentFixture<LottoReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LottoReceiptsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LottoReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListlottoComponent } from './listlotto.component';

describe('ListlottoComponent', () => {
  let component: ListlottoComponent;
  let fixture: ComponentFixture<ListlottoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListlottoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListlottoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

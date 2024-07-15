import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorCeroComponent } from './valor-cero.component';

describe('ValorCeroComponent', () => {
  let component: ValorCeroComponent;
  let fixture: ComponentFixture<ValorCeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValorCeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValorCeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

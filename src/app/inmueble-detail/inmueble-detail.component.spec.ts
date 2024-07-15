import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmuebleDetailComponent } from './inmueble-detail.component';

describe('InmuebleDetailComponent', () => {
  let component: InmuebleDetailComponent;
  let fixture: ComponentFixture<InmuebleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmuebleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InmuebleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

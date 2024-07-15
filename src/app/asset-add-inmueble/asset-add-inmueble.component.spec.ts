import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAddInmuebleComponent } from './asset-add-inmueble.component';

describe('AssetAddInmuebleComponent', () => {
  let component: AssetAddInmuebleComponent;
  let fixture: ComponentFixture<AssetAddInmuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAddInmuebleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAddInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

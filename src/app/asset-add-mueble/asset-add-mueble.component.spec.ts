import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAddMuebleComponent } from './asset-add-mueble.component';

describe('AssetAddInmuebleComponent', () => {
  let component: AssetAddMuebleComponent;
  let fixture: ComponentFixture<AssetAddMuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAddMuebleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAddMuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

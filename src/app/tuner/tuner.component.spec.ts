import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunerComponent } from './tuner.component';

describe('TunerComponent', () => {
  let component: TunerComponent;
  let fixture: ComponentFixture<TunerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TunerComponent]
    });
    fixture = TestBed.createComponent(TunerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

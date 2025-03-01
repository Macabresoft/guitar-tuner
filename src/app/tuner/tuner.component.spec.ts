import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunerComponent } from './tuner.component';
import { FrequencyService } from '../frequency.service';

describe('TunerComponent', () => {
  let component: TunerComponent;
  let fixture: ComponentFixture<TunerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TunerComponent],
      providers: [FrequencyService]
    });
    fixture = TestBed.createComponent(TunerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have exact frequency when only one run', () => {
    component.applyNewFrequency(10);
    let average = component.getAveragedFrequency();
    expect(average).toEqual(10);
  })

  it('should have exact frequency when consistently the same', () => {
    for (let i = 0; i < 4; i++) {
      component.applyNewFrequency(10);
    }

    let average = component.getAveragedFrequency();
    expect(average).toEqual(10);
  })

  it('should have exact frequency when consistently the same with one outlier', () => {
    for (let i = 0; i < 3; i++) {
      component.applyNewFrequency(10);
    }

    component.applyNewFrequency(100);
    
    let average = component.getAveragedFrequency();
    expect(average).toEqual(10);
  })

  it('should average two frequencies when different', () => {
    component.applyNewFrequency(50);
    component.applyNewFrequency(100);
    
    let average = component.getAveragedFrequency();
    expect(average).toEqual(75);
  })
});

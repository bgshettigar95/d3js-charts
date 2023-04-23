import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SccaterPlotComponent } from './sccater-plot.component';

describe('SccaterPlotComponent', () => {
  let component: SccaterPlotComponent;
  let fixture: ComponentFixture<SccaterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SccaterPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SccaterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScheduleComponent } from './info-schedule.component';

describe('InfoScheduleComponent', () => {
  let component: InfoScheduleComponent;
  let fixture: ComponentFixture<InfoScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

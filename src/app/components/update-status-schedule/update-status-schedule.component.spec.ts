import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusScheduleComponent } from './update-status-schedule.component';

describe('UpdateStatusScheduleComponent', () => {
  let component: UpdateStatusScheduleComponent;
  let fixture: ComponentFixture<UpdateStatusScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStatusScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

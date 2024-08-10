import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryListControlComponent } from './inventory-list-control.component';

describe('InventoryListControlComponent', () => {
  let component: InventoryListControlComponent;
  let fixture: ComponentFixture<InventoryListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

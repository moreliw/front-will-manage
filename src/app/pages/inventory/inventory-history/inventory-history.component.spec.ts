import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFormComponent } from './inventory-history.component';

describe('InventoryFormComponent', () => {
  let component: InventoryFormComponent;
  let fixture: ComponentFixture<InventoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

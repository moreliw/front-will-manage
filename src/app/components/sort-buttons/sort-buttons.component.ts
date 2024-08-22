import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sort-buttons',
  templateUrl: './sort-buttons.component.html',
  styleUrls: ['./sort-buttons.component.scss'],
})
export class SortButtonsComponent {
  selectedSort: number = 1;

  @Output() sortOrderChanged = new EventEmitter<number>();

  setSortOrder(order: number) {
    this.selectedSort = order;
    this.sortOrderChanged.emit(this.selectedSort);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {
  @Input() checked: boolean;
  @Output() checkChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggleCheck() {
    this.checked = !this.checked;
    this.checkChange.emit(this.checked);
  }
}

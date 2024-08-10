import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  @Output() search = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        // this.searchBackend(searchTerm);
        this.search.emit(searchTerm);
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // searchBackend(searchTerm: string): void {
  //   console.log(searchTerm);
  // }
}

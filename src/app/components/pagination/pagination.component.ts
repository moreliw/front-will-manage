import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePageRange(): (number | string)[] {
    const maxVisiblePages = 6;
    const pages: (number | string)[] = [];
    let startPage: number;
    let endPage: number;

    if (this.totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (this.currentPage <= maxPagesBeforeCurrent + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (this.currentPage + maxPagesAfterCurrent >= this.totalPages) {
        startPage = this.totalPages - maxVisiblePages + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - maxPagesBeforeCurrent;
        endPage = this.currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < this.totalPages) {
      pages.push('...');
    }

    if (startPage > 1) {
      pages.unshift('...');
    }

    return pages;
  }

  get limitPrevious(): boolean {
    return this.currentPage === 1;
  }

  get limitNext(): boolean {
    return this.currentPage === this.totalPages;
  }

  previousPage() {
    if (!this.limitPrevious) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (!this.limitNext) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      if (page !== this.currentPage) {
        this.pageChange.emit(page);
      }
    } else {
      !this.limitNext
        ? this.pageChange.emit(this.totalPages)
        : this.pageChange.emit(1);
    }
  }
}

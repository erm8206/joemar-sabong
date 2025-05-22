

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lotto-event-summary',
  templateUrl: './lotto-event-summary.component.html',
  styleUrl: './lotto-event-summary.component.scss'
})
export class LottoEventSummaryComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  events: any = [];
  isLoading: boolean = false;

  search: string = '';
  searchSubject: Subject<string> = new Subject();

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchText) => {
      this.pageNumber = 1;
      this.getForApprovals();
    });
  }

  ngOnInit(): void {
    this.getForApprovals();
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }

  async getForApprovals(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const encodedSearch = encodeURIComponent(this.search);
      const res: any = await this._api.get(
        'user',
        `/lotto-events-summary?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodedSearch}`
      );
      this.events = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount;
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getForApprovals();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getForApprovals(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }


}


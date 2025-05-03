
import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
})
export class BetsComponent implements OnInit {
  isLoading: boolean = false;

  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  history: any = [];
  announcement: string = '';

  search: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
  ) { }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageNumber = 1;
      this.getBetSummary();
    });
    this.getBetSummary();
    this.getAnnouncement();
    this._userSub.getUserDetail();
  }

  async getAnnouncement() {
    try {
      const response: any = await this._api.get('user', '/announcement');
      this.announcement = response?.value || '';
    } catch (e) { }
  }

  getFloorValue(value: number) {
    return Math.floor(value);
  }

  async getBetSummary(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const encodedSearch = encodeURIComponent(this.search.trim());
      const res: any = await this._api.get(
        'playernew',
        `/my-bet-summary?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodedSearch}`
      );
      this.history = res.records;
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
    this.getBetSummary();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.getBetSummary();
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }


}

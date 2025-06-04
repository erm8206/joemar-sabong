import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-downlines',
  templateUrl: './downlines.component.html',
  styleUrls: ['./downlines.component.scss'],
})
export class DownlinesComponent implements OnInit, OnDestroy {
  users: any = [];
  isLoading: boolean = false;

  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  sortField: string = 'createdAt';
  sortAsc: boolean = false;

  constructor(private _api: ApiService, private _sub: UserSub) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getDownlines();
    });

    this.getDownlines();
  }

  ngOnDestroy(): void {
    this.searchChanged.unsubscribe();
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.pageNumber = 1;
    this.getDownlines();
  }

  async getDownlines(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/agent/downlines?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}&sort=${this.sortField}&asc=${this.sortAsc}`;
      const response: any = await this._api.get('user', query);
      this.users = response.records || [];
      this.totalCount = response.totalCount;
      this.pageNumber = response.pageNumber;
      this.pageSize = response.pageSize;
      this.totalPages = response.totalPages;
      this.totalItems = response.totalCount;
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getDownlines();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getDownlines(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }

  async setComs(userId: string) {
    const percentage = prompt('Please input percentage (e.g., 10, 10.5, 10.55, 10.555)');
    if (!percentage) return;

    const trimmed = percentage.trim();
    const isValid = /^(\d+|\d+\.\d{1,3})$/.test(trimmed);

    if (!isValid) {
      alert('Invalid input. Please enter a whole number or a number with 1 to 3 decimal places.');
      return;
    }

    try {
      await this._api.post('user', { userId, percentage: parseFloat(trimmed) }, '/set-coms');
      await this.getDownlines(this.pageNumber);
      alert('Success');
    } catch (e) {
      alert(e ?? 'Something went wrong');
    }
  }

  async setComsLotto(userId: string, type: string) {
    const percentage = prompt('Please input percentage.');
    if (!percentage) return;

    const endpoint = '/set-coms-lotto';

    if (!['pick2', 'pick3', 'suertres'].includes(type)) {
      alert('Invalid commission type.');
      return;
    }

    try {
      await this._api.post('user', { userId, percentage, type }, endpoint);
      await this.getDownlines(this.pageNumber);
      alert('Success');
    } catch (e) {
      alert(e ?? 'Something went wrong');
    }
  }
}

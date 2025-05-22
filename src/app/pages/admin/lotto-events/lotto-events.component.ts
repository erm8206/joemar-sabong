import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-lotto-events',
  templateUrl: './lotto-events.component.html',
  styleUrl: './lotto-events.component.scss'
})
export class LottoEventsComponent implements OnInit, OnDestroy {
  from: string = '';
  to: string = '';
  events: any[] = [];
  selectedFight: string = '';
  isLoading: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  // Search
  searchTerm: string = '';
  tag: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    const date = new Date();
    this.from = this.formatDate(date, 0, 0);
    this.to = this.formatDate(date, 23, 59);
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getEvents();
    });

    this.getEvents();
  }

  formatDate(date: Date, hours: number, minutes: number): string {
    const hourString = hours < 10 ? '0' + hours : hours.toString();
    const minuteString = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${this.getDateString(date)}T${hourString}:${minuteString}`;
  }

  getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  ngOnDestroy(): void {
    this.searchChanged.unsubscribe();
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  changeTag(tag: string) {
    this.tag = tag;
    this.getEvents();
  }

  async getEvents(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/lotto-events?pageNumber=${page}&pageSize=${this.pageSize}&startDate=${this.from}&endDate=${this.to}&tag=${encodeURIComponent(this.tag)}&search=${encodeURIComponent(this.searchTerm)}`;
      const res: any = await this._api.get('admin', query);
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
    this.getEvents();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getEvents(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  getDrawDetails(eventID: string) {

    this._router.navigate(['/admin/lotto-events-details', eventID]);
  }

  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }
}

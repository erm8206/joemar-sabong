import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss']
})
export class ListEventsComponent implements OnInit, OnDestroy {
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
  searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getEvents();
    });

    this.getEvents();
  }

  ngOnDestroy(): void {
    this.searchChanged.unsubscribe();
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  async getEvents(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/events?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`;
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

  getFightNumberDetails() {
    if (!this.selectedFight) {
      alert('Please select a fight #!');
      return;
    }

    this._router.navigate(['/admin/fight-details', this.selectedFight]);
  }

  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }
}

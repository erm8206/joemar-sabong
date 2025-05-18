import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-commission-logs-lotto',
  templateUrl: './commission-logs-lotto.component.html',
  styleUrl: './commission-logs-lotto.component.scss'
})
export class CommissionLogsLottoComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  isLoading: boolean = false;
  history: any[] = [];
  search: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private _api: ApiService,
    private _sub: UserSub,
    private _jwt: JwtService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getCommissions();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pageNumber = 1;
        this.getCommissions();
      });
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }

  async getCommissions(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get(
        'points',
        `/commission/lotto?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.search)}`
      );
      this.history = res.records || [];
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
    this.getCommissions();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getCommissions(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }
}

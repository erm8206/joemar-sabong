import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-wallet-log',
  templateUrl: './wallet-log.component.html',
  styleUrls: ['./wallet-log.component.scss'],
})
export class WalletLogComponent implements OnInit, OnDestroy {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  isLoading: boolean = false;
  walletlogs: any = [];

  // Search
  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  constructor(private _api: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getWalletLogs(1);
    });

    this.getWalletLogs(1);
  }

  ngOnDestroy(): void {
    this.searchChanged.unsubscribe();
  }

  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  async getWalletLogs(page: number): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/wallet-log?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`;
      const res: any = await this._api.get('user', query);
      this.walletlogs = res.records || [];
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
    this.getWalletLogs(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getWalletLogs(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }
}

import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-wallet-log',
  templateUrl: './wallet-log.component.html',
  styleUrls: ['./wallet-log.component.scss'],
})
export class WalletLogComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  userLoggendin: UserModel = {};
  isLoading: boolean = false;
  walletlogs: any = [];

  search: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private _api: ApiService,
    private http: HttpClient,
    private _jwt: JwtService,
    private _userSub: UserSub
  ) {
    this._jwt.getDecodedToken().subscribe((data) => {
      this.userLoggendin.username = data?.username;
    });
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageNumber = 1;
      this.getWalletLogs();
    });
    this.getWalletLogs();
    this._userSub.getUserDetail();
  }

  async getWalletLogs(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const encodedSearch = encodeURIComponent(this.search.trim());
      const res: any = await this._api.get(
        'user',
        `/wallet-log?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodedSearch}`
      );
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
    this.getWalletLogs();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.getWalletLogs();
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.search);
  }
}

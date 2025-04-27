import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
@Component({
  selector: 'app-wallet-log',
  templateUrl: './wallet-log.component.html',
  styleUrls: ['./wallet-log.component.scss'],
})
export class WalletLogComponent implements OnInit {
  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  userLoggendin: UserModel = {};
  isLoading: boolean = false;
  walletlogs: any = [];
  constructor(private _api: ApiService, private http: HttpClient,
    private _jwt: JwtService,
  ) {
    this._jwt.getDecodedToken().subscribe((data) => {
      this.userLoggendin.username = data?.username;
    });

  }

  ngOnInit(): void {
    this.getWalletLogs(1);


  }

  async getWalletLogs(page: number): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get('user', `/wallet-log?pageNumber=${page}&pageSize=${this.pageSize}`);
      this.walletlogs = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount
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

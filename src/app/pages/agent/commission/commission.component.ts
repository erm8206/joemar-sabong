import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionComponent implements OnInit {
  searchSubject: Subject<string> = new Subject<string>();
  // Search
  searchTerm: string = '';

  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;
  amount: number = 0;
  commissionConvertHistory: any = [];
  isLoading: boolean = false;
  gameType: string = "";
  constructor(private _userSub: UserSub, private _api: ApiService) { }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageNumber = 1;
      this.getCommissionConvertHistory();
    });

    this._userSub.getUserDetail();
    this.getCommissionConvertHistory();
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  public getAccount(): Observable<UserAccount> {
    return this._userSub.getUserAccount();
  }

  public getUser(): Observable<UserModel> {
    return this._userSub.getUser();
  }

  preventDecimal(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',' || event.key === 'e') {
      event.preventDefault();
    }
  }
  blockDecimalPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';
    if (pastedText.includes('.') || pastedText.includes(',') || /e/i.test(pastedText)) {
      event.preventDefault();
    }
  }



  async getCommissionConvertHistory(page: number = 1): Promise<void> {
    try {
      const res: any = await this._api.get('points', `/convert-commission?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}`);


      this.commissionConvertHistory = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount
    } catch (e) { }
  }


  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getCommissionConvertHistory();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getCommissionConvertHistory(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  selectCommissionType(event: any) {
    alert(event);
  }

  async convertCommission() {
    this.isLoading = true;

    if (this.gameType == 'sabong') {
      try {
        const response: any = await this._api.post(
          'points',
          { amount: this.amount },
          '/convert-commission'
        );
        alert(response.message);
        this._userSub.getUserDetail();
        this.isLoading = false;
        this.getCommissionConvertHistory();
      } catch (e) {
        alert(e ?? 'Something went wrong');
        this.isLoading = false;
      }
    }
    else {
      try {
        const response: any = await this._api.post(
          'points',
          { amount: this.amount, gameType: this.gameType },
          '/convert-commission-lotto'
        );
        alert(response.message);
        this._userSub.getUserDetail();
        this.isLoading = false;
        this.getCommissionConvertHistory();
      } catch (e) {
        alert(e ?? 'Something went wrong');
        this.isLoading = false;
      }
    }

    // try {
    //   await this._api.post(
    //     'points',
    //     { amount: this.amount },
    //     '/convert-commission'
    //   );
    //   alert('Success');
    //   this._userSub.getUserDetail();
    //   this.isLoading = false;
    // } catch (e) {
    //   alert(e ?? 'Something went wrong');
    //   this.isLoading = false;
    // }
  }
}

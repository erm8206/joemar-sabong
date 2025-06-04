import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserAccount, UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';
import { firstValueFrom } from 'rxjs'; // make sure this is imported

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionComponent implements OnInit {
  searchSubject: Subject<string> = new Subject<string>();
  searchTerm: string = '';

  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  amount: number = 0;
  commissionConvertHistory: any = [];
  isLoading: boolean = false;
  gameType: string = "";

  sort: string = 'createdAt';
  asc: boolean = false;


  userType: string = "";

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

  setSort(column: string): void {
    if (this.sort === column) {
      this.asc = !this.asc;
    } else {
      this.sort = column;
      this.asc = true;
    }
    this.getCommissionConvertHistory();
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
      const res: any = await this._api.get(
        'points',
        `/convert-commission?pageNumber=${page}&pageSize=${this.pageSize}&search=${encodeURIComponent(this.searchTerm)}&sort=${this.sort}&asc=${this.asc}`
      );

      this.commissionConvertHistory = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount;
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

    try {
      // Get user details
      const user = await firstValueFrom(this._userSub.getUser());
      const userType = user?.type || '';

      // Validate whole number
      const parsedAmount = Number(this.amount);

      if (!Number.isInteger(parsedAmount)) {
        alert('Amount must be a whole number or a valid number');
        this.isLoading = false;
        return;
      }

      // Determine minimum amount
      let minAmount = 0;

      if (this.gameType === 'sabong') {
        minAmount = userType === 'agent1' ? 1000 : 50;
      } else {
        minAmount = 20; // for all agent types if not sabong
      }

      // Validate against minimum amount
      if (this.amount < minAmount) {
        alert(`Minimum convert amount is ₱${minAmount}.`);
        this.isLoading = false;
        return;
      }

      // Prepare payload and endpoint
      const payload = this.gameType === 'sabong'
        ? { amount: this.amount }
        : { amount: this.amount, gameType: this.gameType };

      const endpoint = this.gameType === 'sabong'
        ? '/convert-commission'
        : '/convert-commission-lotto';

      // Perform conversion
      const response: any = await this._api.post('points', payload, endpoint);
      alert(response.message);

      await this._userSub.getUserDetail(); // refresh user data
      this.getCommissionConvertHistory();
    } catch (e) {
      alert(e ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  }


}

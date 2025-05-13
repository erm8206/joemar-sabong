import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime } from 'rxjs/operators';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-lotto-receipts',
  templateUrl: './lotto-receipts.component.html',
  styleUrl: './lotto-receipts.component.scss'
})
export class LottoReceiptsComponent {

  from: string = '';
  to: string = '';

  isLoading: boolean = false;
  receipts: any = [];

  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
  ) { }

  ngOnInit(): void {


    this.from = this.getToday();
    this.to = this.getToday();

    this.getLottoReceipts();
    this._userSub.getUserDetail();




  }

  getTimeOnly(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // use true if you want 12-hour format
    });
  }


  async getLottoReceipts() {
    this.isLoading = true;
    try {
      const query = `/lotto-bets/receipt?startDate=${this.from}&endDate=${this.to}`;
      const res: any = await this._api.get('user', query);
      this.receipts = res || [];
      console.log(this.receipts)
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }
  getToday(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10); // returns format 'yyyy-MM-dd'
  }

  getTotalWonAmount(bets: any[]): number {
    return bets.reduce((sum, bet) => sum + (bet.wonAmount || 0), 0);
  }


}

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


  progress = 0;
  intervalId: any;
  from: string = '';
  to: string = '';

  isLoading: boolean = false;
  receipts: any = [];

  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
  ) { }

  ngOnInit(): void {

    this.startLoading();

    const today = new Date();

    this.from = this.formatDate2(today, 0, 0);
    this.to = this.formatDate2(today, 23, 59);

    this.getLottoReceipts();
    this._userSub.getUserDetail();




  }

  formatDate2(date: Date, hours: number, minutes: number): string {
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

  getTimeOnly(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // use true if you want 12-hour format
    });
  }

  startLoading() {
    this.intervalId = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 1;
      } else {
        this.progress = 0; // Loop back to 0%
      }
    }, 10); // Adjust speed as needed
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

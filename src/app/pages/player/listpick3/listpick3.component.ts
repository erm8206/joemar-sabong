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
  selector: 'app-listpick3',
  templateUrl: './listpick3.component.html',
  styleUrl: './listpick3.component.scss'
})
export class Listpick3Component implements OnInit {
  searchChanged: Subject<string> = new Subject<string>();
  searchTerm: string = "";

  from: string = '';
  to: string = '';

  isLoading: boolean = false;
  eventsLotto: any = [];

  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
  ) { }

  ngOnInit(): void {


    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.getLottoEvents();
    });

    const today = new Date()
    this.from = this.formatDate2(today, 0, 0);
    this.to = this.formatDate2(today, 23, 59);

    this.getLottoEvents();
    this._userSub.getUserDetail();




  }
  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }

  getTimeOnly(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // use true if you want 12-hour format
    });
  }


  async getLottoEvents() {
    this.isLoading = true;
    try {
      const query = `/events-lotto/pick3?startDate=${this.from}&endDate=${this.to}`;
      const res: any = await this._api.get('playernew', query);
      this.eventsLotto = res || [];
      console.log(this.eventsLotto)
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
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
  getToday(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10); // returns format 'yyyy-MM-dd'
  }



}

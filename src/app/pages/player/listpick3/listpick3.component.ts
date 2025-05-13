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

  from: string = '';
  to: string = '';

  isLoading: boolean = false;
  eventsLotto: any = [];

  constructor(
    private _api: ApiService,
    private _userSub: UserSub,
  ) { }

  ngOnInit(): void {


    this.from = this.getToday();
    this.to = this.getToday();

    this.getLottoEvents();
    this._userSub.getUserDetail();




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
  getToday(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10); // returns format 'yyyy-MM-dd'
  }



}

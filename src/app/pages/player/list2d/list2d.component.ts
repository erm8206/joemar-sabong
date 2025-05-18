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
  selector: 'app-list2d',
  templateUrl: './list2d.component.html',
  styleUrl: './list2d.component.scss'
})
export class List2dComponent implements OnInit {
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


    this.from = this.getToday();
    this.to = this.getToday();

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
      const query = `/events-lotto/pick2?startDate=${this.from}&endDate=${this.to}&search=${this.searchTerm}`;
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

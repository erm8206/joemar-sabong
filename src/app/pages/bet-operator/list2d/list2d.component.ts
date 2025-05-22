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

@Component({
  selector: 'app-list2d',
  templateUrl: './list2d.component.html',
  styleUrl: './list2d.component.scss'
})
export class List2dComponent implements OnInit {
  model: any = {};

  editModel: any = {};

  from: string = '';
  to: string = '';


  eventsLotto: any[] = [];
  isLoading: boolean = false;

  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // Search
  searchTerm: string = '';
  searchChanged: Subject<string> = new Subject<string>();

  constructor(private _api: ApiService) { }

  ngOnInit(): void {

    const today = new Date();
    this.from = this.formatDate2(today, 0, 0);
    this.to = this.formatDate2(today, 23, 59);

    this.searchChanged.pipe(debounceTime(400)).subscribe((term) => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.getLottoEvents();
    });

    this.getLottoEvents();


  }



  onSearchChange(value: string): void {
    this.searchChanged.next(value);
  }


  editModelData(fetchData: any = []) {
    this.editModel = fetchData;

    console.log(this.editModel);
  }
  async getLottoEvents(page: number = this.pageNumber): Promise<void> {
    this.isLoading = true;
    try {
      const query = `/events-lotto/pick2?pageNumber=${page}&pageSize=${this.pageSize}&startDate=${this.from}&endDate=${this.to}&search=${encodeURIComponent(this.searchTerm)}`;
      const res: any = await this._api.get('betopsnew', query);
      this.eventsLotto = res.records || [];
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
    this.getLottoEvents();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getLottoEvents(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }


  getToday(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10); // returns format 'yyyy-MM-dd'
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




  onDrawDateChange(date: string, type: 'from' | 'to') {
    const formatted = this.formatDate(date);
    if (type === 'from') {
      this.model.drawDateFrom = formatted;
    } else {
      this.model.drawDateTo = formatted;
    }
  }


  onDrawTimeChange(time: string) {
    // Optional: format to ensure HH:mm format (e.g., pad zeros if needed)
    const [hour, minute] = time.split(':');
    const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    this.model.drawTime = formattedTime;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // always two digits
    const day = ('0' + d.getDate()).slice(-2);         // always two digits
    return `${year}-${month}-${day}`;
  }
  async addEvent() {

    this.model.tags = "pick2";


    const requiredFields = [
      'drawDateFrom',
      'drawDateTo',
      'drawName',
      'drawTime',
      'minChoice',
      'maxChoice',
      'minBet',
      'maxBet',
      'numSelect',
      'winMultiplier',
      'videoUrl',
      'resultUrl',
      'tags'
    ];

    for (const field of requiredFields) {
      if (!this.model[field]) {
        alert(`${this.toLabel(field)} is required.`);
        return;
      }
    }

    // Proceed with form submission
    console.log('All fields valid:', this.model);

    try {
      const response: any = await this._api.post(
        'betopsnew',
        { ...this.model },
        '/events-lotto'
      );
      this.model = {};

      await this.getLottoEvents(this.pageNumber);
      alert('Success !');
    } catch (e) {
      alert(e);
    }

  }


  async editEvent() {


    const requiredFields = [
      'drawDate',
      'drawName',
      'minChoice',
      'maxChoice',
      'minBet',
      'maxBet',
      'numSelect',
      'winMultiplier',
      'videoUrl',
      'resultUrl',
      'tags'
    ];

    for (const field of requiredFields) {
      if (!this.editModel[field]) {
        alert(`${this.toLabel(field)} is required.`);
        return;
      }
    }

    // Proceed with form submission
    console.log('All fields valid:', this.editModel);

    try {
      const response: any = await this._api.put(
        'betopsnew',
        { ...this.editModel },
        '/events-lotto'
      );
      this.editModel = {};

      await this.getLottoEvents(this.pageNumber);
      alert('Success Updated the Event!');
    } catch (e) {
      alert(e);
    }

  }

  toLabel(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')     // insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // capitalize first letter
  }

}

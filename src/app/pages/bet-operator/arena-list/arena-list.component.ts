import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-arena-list',
  templateUrl: './arena-list.component.html',
  styleUrls: ['./arena-list.component.scss'],
})
export class ArenaListComponent implements OnInit {

  colors = ['red', 'blue'];
  routes = ['meron', 'wala'];

  tags = ['sabong', 'vivamax', 'e-sports'];



  isLoading: boolean = false;
  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  results: any = [];
  model: any = {
    "name": "",
    "plasada": "",
    "videoUrl": "",
    "left": {},
    "right": {},
  };
  dtTrigger: Subject<any> = new Subject();
  currentEvent: any = {
    "name": "",
    "plasada": "",
    "videoUrl": "",
    "left": {
      "name": "",
      "color": "",
      "route": ""
    },
    "right": {
      "name": "",
      "color": "",
      "route": ""
    },
    "id": "",
    "status": ""
  };
  constructor(private _api: ApiService) { }

  ngOnInit(): void {

    this.getReports();
  }

  async getReports(page: number = 1): Promise<void> {
    try {
      const res: any = await this._api.get('betopsnew', `/events?pageNumber=${page}&pageSize=${this.pageSize}`);
      this.results = res.records || [];
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
    this.getReports();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getReports(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }

  async editEvent() {
    this.currentEvent.plasada = this.currentEvent.plasada / 100;
    let newEventData: any = {};
    newEventData = {
      tag: this.currentEvent.tag,
      name: this.currentEvent.name,
      left: this.currentEvent.left,
      right: this.currentEvent.right,
      plasada: this.currentEvent.plasada,
      videoUrl: this.currentEvent.videoUrl,
      status: this.currentEvent.status,
      id: this.currentEvent.id,
    };

    try {
      const response: any = await this._api.put(
        'betopsnew',
        newEventData,
        '/events'
      );

      this.currentEvent = {
        "name": "",
        "plasada": "",
        "videoUrl": "",
        "left": {},
        "right": {},
        "id": "",
        "status": ""
      };
      await this.getReports();



      alert('Success');
    } catch (e) {
      alert(e);
    }
  }

  getData(item: any = []) {
    this.currentEvent = { ...item }; // clone object
    this.currentEvent.plasada = item.plasada * 100; // safe to modify
  }


  async duplicateEvent() {
    this.currentEvent.plasada = this.currentEvent.plasada / 100;
    let newEventData: any = {};
    newEventData = {
      tag: this.currentEvent.tag,
      name: this.currentEvent.name,
      left: {
        name: this.currentEvent.left.name,
        color: this.currentEvent.left.color,
        route: this.currentEvent.left.route,
      },
      right: {
        name: this.currentEvent.right.name,
        color: this.currentEvent.right.color,
        route: this.currentEvent.right.route,
      },
      plasada: this.currentEvent.plasada,
      videoUrl: this.currentEvent.videoUrl,
    };


    try {
      const response: any = await this._api.post(
        'betopsnew',
        newEventData,
        '/events'
      );

      this.currentEvent = {
        "name": "",
        "plasada": "",
        "videoUrl": "",
        "left": {},
        "right": {},
        "id": "",
        "status": ""
      };
      await this.getReports();

      alert('Success !');
    } catch (e) {
      alert(e);
    }
  }

  async addEvent() {

    this.model.plasada = this.model.plasada / 100;

    try {
      const response: any = await this._api.post(
        'betopsnew',
        { ...this.model },
        '/events'
      );
      this.model = {
        "name": "",
        "plasada": "",
        "videoUrl": "",
        "left": {},
        "right": {},
      };
      await this.getReports();

      alert('Success !');
    } catch (e) {
      alert(e);
    }
  }


}

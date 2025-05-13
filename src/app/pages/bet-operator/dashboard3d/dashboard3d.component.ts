
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { WebSocketService } from 'src/app/services/web-socket-service';
import { AfterViewInit, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard3d',
  templateUrl: './dashboard3d.component.html',
  styleUrl: './dashboard3d.component.scss'
})
export class Dashboard3dComponent {
  toggle: boolean = false;
  iframeUrl: SafeResourceUrl = '';
  result: number[] = [];
  event: any = [];

  isLoading: boolean = false;

  model: any = {
    minChoice: 0,
    maxChoice: 9
  };

  betSummary: any = {};

  eventId: string = "";
  numberRange: number[] = [];
  itemsPerRow: number = 8; // static value

  constructor(
    private webSocketService: WebSocketService,
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router,
    private _api: ApiService,
    private _zone: NgZone,
  ) {
    this.eventId = this._route.snapshot.paramMap.get('eventId');
    console.log(this.eventId);
    if (!this.eventId) {
      this._router.navigate(['/operator/list-3d']);
    }
  }

  ngOnInit(): void {


    this.getDrawDetails();
    this.lottoBetSummary();



  }

  async updateEventResult() {
    this.isLoading = true;

    if (this.result.length < 2) {
      alert("Please select 2 numbers!");
      return;
    }
    try {
      const state = confirm(`Update Result?`);
      if (!state) {
        return;
      }
      const response: any = await this._api.post(
        'betopsnew',
        { result: this.result },
        `/lotto-event/update-result/${this.eventId}`
      );
      alert(response?.message);
      this.getDrawDetails();
      this.lottoBetSummary();

      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async updateEventRevert() {
    this.isLoading = true;
    try {
      const state = confirm(`Revert Event?`);
      if (!state) {
        return;
      }
      const response: any = await this._api.put(
        'betopsnew',
        {},
        `/lotto-event/revert/${this.eventId}`
      );
      alert(response?.message);
      this.getDrawDetails();
      this.lottoBetSummary();

      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }
  async updateEventCancelled() {
    this.isLoading = true;
    try {
      const state = confirm(`Cancel Event?`);
      if (!state) {
        return;
      }
      const response: any = await this._api.put(
        'betopsnew',
        {},
        `/lotto-event/cancel/${this.eventId}`
      );
      alert(response?.message);
      this.getDrawDetails();
      this.lottoBetSummary();

      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async updateEventClose() {
    this.isLoading = true;
    try {
      const state = confirm(`Update Event CLOSE ?`);
      if (!state) {
        return;
      }
      const response: any = await this._api.put(
        'betopsnew',
        {},
        `/lotto-event/close/${this.eventId}`
      );
      alert(response?.message);
      this.getDrawDetails();
      this.lottoBetSummary();

      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async getDrawDetails() {

    try {
      const response: any = await this._api.get(
        'betopsnew',
        `/events-lotto/details/${this.eventId}`
      );

      this.event = response;

      //set min and choice
      const min = Number(this.event.minChoice);
      const max = Number(this.event.maxChoice);

      if (min >= 0 && max >= min) {
        this.numberRange = Array.from({ length: max - min + 1 }, (_, i) => i + min);
      } else {
        this.numberRange = [];
      }

      if (this.event.videoUrl) {
        this.getIframe(this.event.videoUrl);
      }

    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }


  async lottoBetSummary() {

    try {
      const response: any = await this._api.get(
        'betopsnew',
        `/lotto-bets-summary/${this.eventId}`
      );

      this.betSummary = response;


    } catch (e) {
      alert(e ?? 'Something went wrong!');
    }
  }

  async closeDraw() {


  }

  async updateResult() {

  }

  async revertResult() {

  }

  async getIframe(url: string) {
    if (url) {
      this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
      this.toggle = true;
    }
  }



  getRows(array: number[], itemsPerRow: number): number[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      rows.push(array.slice(i, i + itemsPerRow));
    }
    return rows;
  }




  onNumberClick(num: number): void {
    if (this.result.length < 3) {
      this.result.push(num);
    } else {
      alert('You can only select 3 numbers.');
    }
  }

  clearResult() {
    this.result = [];
  }

  removeNumber(index: number): void {
    this.result.splice(index, 1);
  }



}

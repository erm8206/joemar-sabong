
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { WebSocketService } from 'src/app/services/web-socket-service';
import { AfterViewInit, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard2d',
  templateUrl: './dashboard2d.component.html',
  styleUrl: './dashboard2d.component.scss'
})
export class Dashboard2dComponent {
  toggle: boolean = false;
  iframeUrl: SafeResourceUrl = '';
  result: number[] = [];
  event: any = [];

  model: any = {
    minChoice: 0,
    maxChoice: 9
  };

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
      this._router.navigate(['/operator/list-2d']);
    }
  }

  ngOnInit(): void {


    this.getDrawDetails();



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
    if (this.result.length < 2) {
      this.result.push(num);
    } else {
      alert('You can only select 2 numbers.');
    }
  }

  clearResult() {
    this.result = [];
  }

  removeNumber(index: number): void {
    this.result.splice(index, 1);
  }



}

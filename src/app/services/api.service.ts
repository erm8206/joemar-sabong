import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  baseUrl: string = environment.baseUrl;

  headers: any;
  currentUser: any = {};
  endpoints: any = {
    auth: 'auth',
    admin: 'admin',
    user: 'user',
    profile: 'profile',
    points: 'points',
    player: 'player',
    playernew: 'player-new',
    bets2: 'bets2',
    betops: 'bet-ops',
    betopsnew: 'bet-ops-new',
    betops2: 'bet-ops2',
    loader: 'loader',
    pick2: 'pick2',
    pick2bet: 'player-pick2',
    pick3: 'pick3',
    pick3bet: 'player-pick3',
    gameending: 'game-ending',
    gameendingbet: 'player-game-ending',
    suertres: 'suertres',
    suertresbet: 'player-suertres',
    bets: 'bets',
    eventslotto: 'events-lotto'

  };

  constructor(private http: HttpClient) { }

  async get(name: string, params: string = '', query: string = '') {
    let response = this.http
      .get(`${this.baseUrl}/${this.endpoints[name]}${params}${query}`)
      .toPromise();
    return response;
  }

  async post(name: string, body: any, params: string = '', query: string = '') {
    let response = this.http
      .post(`${this.baseUrl}/${this.endpoints[name]}${params}${query}`, body)
      .toPromise();
    return response;
  }

  async delete(
    name: string,
    params: string = '',
    query: string = ''
  ) {
    let response = this.http
      .delete(`${this.baseUrl}/${this.endpoints[name]}${params}${query}`)
      .toPromise();
    return response;
  }

  async put(
    name: string,
    body: any = {},
    params: string = '',
    query: string = ''
  ) {
    let response = this.http
      .put(`${this.baseUrl}/${this.endpoints[name]}${params}${query}`, body)
      .toPromise();
    return response;
  }

  async register(data: object) {
    let response = this.http.post(`${this.baseUrl}/user`, data).toPromise();
    return response;
  }
  async login(data: object) {
    let response = this.http.post(`${this.baseUrl}/login`, data).toPromise();
    return response;
  }

  async generateReport(body: any) {
    return this.http
      .post(`${this.baseUrl}/admin/excel-history`, body, {
        responseType: 'blob',
      })
      .toPromise();
  }

  async downloadReport(data: any) {
    return this.http
      .post(
        `${this.baseUrl}/${data.type}/download/${data.drawId}`,
        {},
        {
          responseType: 'blob',
        }
      )
      .toPromise();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-fight-details',
  templateUrl: './fight-details.component.html',
  styleUrl: './fight-details.component.scss'
})
export class FightDetailsComponent {
  isLoading: boolean = false;
  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;
  betHistory: any = [];
  summary: any = {};
  fightId: string = "";


  constructor(private _userSub: UserSub, private _api: ApiService, private _route: ActivatedRoute, private _router: Router) {
    this.fightId = this._route.snapshot.paramMap.get('fightNumberId');
    if (!this.fightId) {
      this._router.navigate(['/admin/list-events']);
    }


  }

  ngOnInit(): void {
    this.fightNumerDetails();
    this.getBets();

  }
  async getBets(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get('admin', `/bets/${this.fightId}?pageNumber=${page}&pageSize=${this.pageSize}`);
      this.betHistory = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount;
      this.isLoading = false;
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getBets();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getBets(page);
    }
  }
  async fightNumerDetails() {
    try {
      const result: any = await this._api.get('admin', `/fightnumber/${this.fightId}`);
      this.summary = result;

      var totalRealMeron = 0;
      var totalRealWala = 0;

      totalRealMeron = this.summary.totalMeronBets - this.summary.totalFakeMeronBets;
      totalRealWala = this.summary.totalWalaBets - this.summary.totalFakeWalaBets;

      if (this.summary.result == 'meron') {
        var winAmount = 0;
        var totalBets = 0
        winAmount = totalRealMeron * (this.summary.meronPercentage / 100);
        totalBets = totalRealMeron + totalRealWala + this.summary.totalDrawBets;
        this.summary.betWinLose = totalBets - winAmount;

      }
      else if (this.summary.result == 'wala') {
        var winAmount = 0;
        var totalBets = 0
        winAmount = totalRealWala * (this.summary.walaPercentage / 100);
        totalBets = totalRealMeron + totalRealWala + this.summary.totalDrawBets;
        this.summary.betWinLose = totalBets - winAmount;

      }
      else if (this.summary.result == 'draw') {
        var winAmount = 0;
        var totalBets = 0;

        winAmount = this.summary.totalDrawBets * 8;
        totalBets = this.summary.totalDrawBets;
        this.summary.betWinLose = totalBets - winAmount;
      }
      else {
        this.summary.betWinLose = 0;
      }


    } catch (e) { }
  }

}

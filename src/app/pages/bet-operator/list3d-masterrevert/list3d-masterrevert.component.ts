import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-list3d-masterrevert',
  templateUrl: './list3d-masterrevert.component.html',
  styleUrl: './list3d-masterrevert.component.scss'
})
export class List3dMasterrevertComponent implements OnInit {

  disbursedLoading: boolean = false;

  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  drawEvents: any = [];
  isLoading: boolean = false;
  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {


    this.getDrawEvents();
  }


  async masterRevert(id: string) {
    let tags = "suertres"
    this.isLoading = true;
    try {
      const state = confirm(`Proceed on reverting? this will revert all data on its last state!`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put(
        'betops',
        { id, tags },
        `/lotto/master-revert`
      );

      alert(response.message)
      this.getDrawEvents(this.pageNumber);
      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async getDrawEvents(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get('betops', `/lotto/master-revert/suertres?pageNumber=${page}&pageSize=${this.pageSize}`);
      this.drawEvents = res.records || [];
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
    this.getDrawEvents();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getDrawEvents(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }



  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }

}

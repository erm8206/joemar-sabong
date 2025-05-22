import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserModel } from 'src/app/services/models/user.model';
import { UserSub } from 'src/app/services/subscriptions/user.sub';

@Component({
  selector: 'app-master-revert',
  templateUrl: './master-revert.component.html',
  styleUrls: ['./master-revert.component.scss']
})
export class MasterRevertComponent implements OnInit {

  disbursedLoading: boolean = false;

  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  fightNumbers: any = [];
  isLoading: boolean = false;
  constructor(
    private _sub: UserSub,
    private _api: ApiService,
    private _router: Router
  ) { }

  ngOnInit(): void {


    this.getFightNumbers();
  }

  async revertResult(id: string) {
    this.isLoading = true;

    try {
      const response: any = await this._api.post('betopsnew', {}, `/revert-result/${id}`);
      alert(response?.message);
      this.getFightNumbers(this.pageNumber);
      this.isLoading = false;
    } catch (e) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async masterRevert(id: string) {
    this.isLoading = true;
    try {
      const state = confirm(`Proceed on reverting? this will revert all data on its last state!`);
      if (!state) {
        this.isLoading = false;
        return;
      }
      const response: any = await this._api.put(
        'betops',
        { id },
        `/sabong/master-revert`
      );

      alert("Revert Success")
      this.getFightNumbers(this.pageNumber);
      this.isLoading = false;
    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }


  async reDisbursedResult(id: string) {
    this.disbursedLoading = true;

    try {
      const response: any = await this._api.post(
        'betopsnew',
        {},
        `/redisbursed-result/${id}`
      );
      this.disbursedLoading = false;
      alert(response?.message);

      this.getFightNumbers(this.pageNumber);

    } catch (e) {
      this.disbursedLoading = false;
      alert(e ?? 'Something went wrong');
    }
  }


  async updateWinner(result: string, id: string) {
    this.isLoading = true;
    try {
      let resultString = 'Update RESULT to ' + result;
      const state = confirm(resultString);
      if (!state) {
        return;
      }
      await this._api.put('betopsnew', {
        'id': id,
        'result': result

      }, `/fightnumber`);
      this.isLoading = false;
      this.getFightNumbers(this.pageNumber);

    } catch (e: any) {
      alert(e ?? 'Something went wrong');
      this.isLoading = false;
    }
  }

  async getFightNumbers(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get('betops', `/sabong/master-revert?pageNumber=${page}&pageSize=${this.pageSize}`);
      this.fightNumbers = res.records || [];
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
    this.getFightNumbers();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getFightNumbers(page);
    }
  }

  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }



  public getUser(): Observable<UserModel> {
    return this._sub.getUser();
  }

}

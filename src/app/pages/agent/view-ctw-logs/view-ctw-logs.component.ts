import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-view-ctw-logs',
  templateUrl: './view-ctw-logs.component.html',
  styleUrls: [],
})
export class ViewCtwLogsComponent implements OnInit {

  // Pagination data from response
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;


  isLoading: boolean = false;
  agentId: string = '';
  agentName: string = '';
  results: any = [];
  constructor(private _route: ActivatedRoute, private _api: ApiService) {
    this.agentId = this._route.snapshot.paramMap.get('agentId') || '';
    this.agentName = this._route.snapshot.queryParamMap.get('name') || '';
  }

  ngOnInit(): void {


    this.getCtwHistory();
  }

  async getCtwHistory(page: number = 1): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this._api.get(
        'user',
        `/ctw-logs/${this.agentId}`
      );

      this.results = res.records || [];
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalCount
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      alert(e ?? 'Something went wrong')

    }
  }



  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.getCtwHistory();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getCtwHistory(page);
    }
  }


  getShowingRangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalItems);
  }
}




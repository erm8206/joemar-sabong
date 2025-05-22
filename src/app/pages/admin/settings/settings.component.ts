
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  cashin: boolean = false;
  cashout: boolean = false;
  convertComms: boolean = false;

  constructor(private _api: ApiService) { }


  ngOnInit(): void {
    this.getSettingsConfig();
  }



  onCheckboxChange() {

    this.changeSettings();


  }

  async getSettingsConfig(): Promise<void> {
    try {
      const query = `/set-config`;
      const response: any = await this._api.get('admin', query);

      this.cashin = response.enableCashIn;
      this.cashout = response.enableCashOut;
      this.convertComms = response.enableConvertComms;

      console.log(response)

    } catch (err) {
      console.error('Error fetching data:', err);
    }

  }


  async changeSettings() {
    try {

      const response: any = await this._api.post('admin',
        {
          enableWithdrawal: this.cashout,
          enableDeposit: this.cashin,
          enableConvertComms: this.convertComms
        },
        '/set-config');

      alert(response.message);

    } catch (e) {
      alert(e ?? 'Server Error');
    }
  }



}

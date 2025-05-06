import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard3d',
  templateUrl: './dashboard3d.component.html',
  styleUrl: './dashboard3d.component.scss'
})
export class Dashboard3dComponent {

  result: number[] = [];


  model: any = {
    minChoice: 0,
    maxChoice: 9
  };


  numberRange: number[] = [];
  itemsPerRow: number = 8; // static value

  ngOnInit(): void {
    this.updateNumberRange();
  }

  updateNumberRange(): void {
    const min = Number(this.model.minChoice);
    const max = Number(this.model.maxChoice);

    if (min >= 0 && max >= min) {
      this.numberRange = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    } else {
      this.numberRange = [];
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

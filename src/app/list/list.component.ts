import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Output() onRecordSelect = new EventEmitter();
  @Input() showList = false;                              // 每次切換到紀錄頁籤，showList 就會改變，就會重新抓取資料
  monthData: any[] = [];

  constructor(
    private service: AppService
  ) { }

  ngOnInit() {
    this.fetchRecords();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showList) {
      if (this.showList === true) {
        this.fetchRecords();
      }
    }
  }

  /**
   * 取得記帳紀錄列表
   */
  fetchRecords(): void {
    this.service.fetchRecordByMonth().then(res => {
      this.monthData = res.map(item => {
        item.cost = this.sumCost(item[0]);
        item.costWithoutInvest = this.getMinusInvestCost(item[0]);
        return item;
      });
    });
  }

  /**
   * 點擊某筆記錄
   */
  onRecordClick(record): void {
    this.onRecordSelect.emit(record);
  }

  sumCost(records: any[]): number {
    return records.reduce((pre, cur) => {
      if (cur.category.id !== 8) {
        return pre += cur.price;
      } else {
        return pre;
      }
    }, 0);
  }

  getMinusInvestCost(records: any[]): number {
    return records
      .filter(item => item.category.name !== '投資')
      .reduce((pre, cur) => {
        if (cur.category.id !== 8) {
          return pre += cur.price;
        } else {
          return pre;
        }
      }, 0);
  }

}

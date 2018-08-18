import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Output() onRecordSelect = new EventEmitter();
  @Input() showList = false;
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

  fetchRecords(): void {
    this.service.fetchRecordByMonth().then(res => {
      this.monthData = res.map(item => {
        item.cost = this.sumCost(item[0]);
        return item;
      });
    });
  }

  /**點擊某筆記錄 */
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

}

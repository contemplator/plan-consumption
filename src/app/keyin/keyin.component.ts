import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SpendRecord, CategoryItem, Category } from '../../viewmodels';
import { AppService } from '../app.service';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-keyin',
  templateUrl: './keyin.component.html',
  styleUrls: ['./keyin.component.scss']
})
export class KeyinComponent implements OnInit {
  @Input() record: SpendRecord = new SpendRecord();     // 收支紀錄
  categories: SelectItem[] = [];                        // 分類列表
  items: SelectItem[] = [];                             // 全部項目列表
  filtedItems: SelectItem[] = [];                       // 分類下的項目列表

  constructor(
    private service: AppService
  ) { }

  ngOnInit() {
    this.initCategoryList();
  }

  initCategoryList(): void {
    this.service.fetchCategoryList().subscribe(res => {

      this.categories = res.map(item => {
        const data = item.payload.val();
        return {
          label: data.name,
          value: data
        };
      });

      this.record.category = this.categories[0].value;
      this.initItems();
    });
  }

  initItems(): void {
    this.service.fetchCategoryItemList().subscribe(res => {
      this.items = res.map(item => {
        const data = item.payload.val();
        return {
          label: data.name,
          value: data
        };
      });
      this.onCategorySelect({ originEvent: {}, value: this.categories[0].value });
    });
  }

  /**
   * 選擇分類事件
   * @param category
   */
  onCategorySelect(event): void {
    const category = event.value;
    this.filtedItems = this.items
      .filter(item => item.value.categoryId === category.id)
      .filter(item => item.value.deleted !== true)
      .map(item => {
        return {
          label: item.value.name,
          value: {
            id: item.value.id,
            name: item.value.name
          }
        };
      });

    this.record.item = this.filtedItems[0].value;
  }

  /**
   * 修正輸入金額
   * @param value
   */
  fixInput(value): void {
    if (value === '') { value = 0; }
    try {
      this.record.price = parseInt(value, 10);
    } catch (error) {
      console.error(value);
      this.record.price = 0;
    }
  }

  /**
   * 送出並儲存資料
   */
  onSendClick(): void {
    this.adjustData();
    if (this.record.key) {
      this.service.updateRecord(this.record.key, this.record);
    } else {
      this.service.insertRecord(this.record);
    }

    this.cleanRecord();
  }

  /**
   * 送出前調整資料
   */
  adjustData(): void {
    this.record.price = parseInt(this.record.price + '', 10);
    const time = new Date(this.record.time);
    let hour = '';
    let minute = '';
    if(isNaN(time.getTime())){
      hour = this.record.time.substring(0, 2);
      minute = this.record.time.substring(3, 5);
    }else{
      hour = time.getHours().padLeft(2);
      minute = time.getMinutes().padLeft(2);
    }
    const second = new Date().getSeconds().padLeft(2);
    this.record.datetime = (new Date(this.record.date)).toFormatString('YYYY-MM-DD') + ' ' + hour + ':' + minute + ':' + second;
  }

  /**
   * 清除上一次輸入的資料，保留分類選擇
   */
  cleanRecord(): void {
    const today = new Date();
    this.record.datetime = today.toFormatString('YYYY-MM-DD hh:mm:ss');
    this.record.datetime = this.record.datetime.replace(' ', 'T');

    this.record.price = 0;
    this.record.remark = '';
  }

  /**
   * 清空按鈕
   */
  onResetClick(): void {
    const today = new Date();
    this.record.datetime = today.toFormatString('YYYY-MM-DD hh:mm:ss');
    this.record.datetime = this.record.datetime.substring(0, 10) + 'T' + this.record.datetime.substring(11, 19);
    this.record.price = null;
    this.record.category = this.categories[0].value;
    this.filtedItems = this.items.filter(item => item.value.categoryId === 1).filter(item => item.value.deleted !== true);
    this.record.item = this.filtedItems[0].value;
    this.record.remark = '';
    this.record.key = '';
  }

}

import { Component, ViewChild } from '@angular/core';
import { SpendRecord } from '../viewmodels';
import { TabView } from 'primeng/primeng';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('tabView') tabView: TabView;
  selectedRecord: SpendRecord = new SpendRecord();
  showList = false;

  constructor() { }

  /**
   * 在紀錄頁籤點擊某筆紀錄
   * 切換到修改畫面
   */
  onRecordSelect(event: SpendRecord): void {
    this.selectedRecord = Object.assign({}, event);
    setTimeout(() => {
      const tabs = this.tabView.tabs;
      this.tabView.open(null, tabs[0]);
    }, 50);
  }

  /**
   * 切換頁籤
   */
  onTabChange(event: { originalEvent: MouseEvent, index: number }): void {
    const tabIndex = event.index;
    if (tabIndex === 1) {
      this.showList = true;
    } else {
      this.showList = false;
    }
  }
}

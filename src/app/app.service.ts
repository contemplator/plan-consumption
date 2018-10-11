import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toArray, mergeMap, map, zip } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable, from } from 'rxjs';
import { groupBy } from 'rxjs/operators';
import { Category, SpendRecord, CategoryItem, FirebaseObject } from '../viewmodels';

@Injectable()
export class AppService {
  recordCollection: Observable<{}[]>;
  categoryCollection: Observable<AngularFireAction<DatabaseSnapshot<Category>>[]>;
  categoryItemCollection: Observable<AngularFireAction<DatabaseSnapshot<CategoryItem>>[]>;
  recordList: any[] = [];
  recordListMonth: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private firebase: AngularFireDatabase,
  ) {
    this.initFirebaseCollection();
  }

  /**
   * 初始化取得資料的 collection
   */
  initFirebaseCollection(): void {
    this.recordCollection = this.firebase.list('record', ref => {
      return ref.orderByChild('datetime').limitToLast(200);
    }).snapshotChanges();
    this.categoryCollection = this.firebase.list<Category>('category').snapshotChanges();
    this.categoryItemCollection = this.firebase.list<CategoryItem>('item').snapshotChanges();
  }

  /**
   * 取得記錄
   */
  fetchRecord(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.recordCollection
        .subscribe(
          (res: any) => {
            this.recordList = res.map(item => {
              const data = item.payload.val();
              data.key = item.key;
              return data;
            });
            this.recordList.sort(this.sortByDateDesc);
            resolve(this.recordList);
          },
          error => {
            reject(error);
          });
    });
  }

  /**
   * 取得以月分組後的紀錄
   */
  async fetchRecordByMonth(): Promise<any[]> {
    const records = await this.fetchRecord();
    const recordByMonth = this.groupByMonth(records);
    return recordByMonth;
  }

  /**
   * 依照日期時間降冪排序
   */
  sortByDateDesc(a, b): number {
    if (a.datetime > b.datetime) { return -1; }
    if (a.datetime < b.datetime) { return 1; }
    return 0;
  }

  /**
   * 將記錄以月分組
   * @param records
   */
  groupByMonth(records: any[]): any[] {
    const recordByMonth = [];
    from(records)
      .pipe(
        groupBy(item => item.datetime.substring(0, 7)),
        mergeMap(group => {
          return group.pipe(
            toArray(),
            zip(from(group).pipe(
              map(item => item.datetime.substring(0, 7)))
            )
          );
        })
      )
      .subscribe(res => {
        recordByMonth.push(res);
      }, error => {
        console.error(error);
      });

    return recordByMonth;
  }

  /**
   * 取得分類列表
   */
  fetchCategoryList(): Observable<AngularFireAction<DatabaseSnapshot<Category>>[]> {
    return this.categoryCollection;
  }

  /**
   * 更新紀錄
   * @param dataKey
   * @param record
   */
  updateRecord(dataKey: string, record: SpendRecord): void {
    this.firebase.list('record').update(dataKey, record);
  }

  /**
   * 新增紀錄
   * @param record
   */
  insertRecord(record: SpendRecord): void {
    this.firebase.list('record').push(record);
  }

  /**
   * 取得分類下項目列表
   */
  fetchCategoryItemList(): Observable<AngularFireAction<DatabaseSnapshot<CategoryItem>>[]> {
    return this.categoryItemCollection;
  }

  /**
   * 新增或修改分類
   * @param category
   */
  setCategory(category: FirebaseObject<Category>): void {
    if (category.key) {
      this.firebase.list('category').update(category.key, category.value);
    } else {
      this.firebase.list('category').push(category.value);
    }
  }

  /**
   * 新增或修改分類項目
   * @param category
   */
  setCategoryItem(categoryItem: FirebaseObject<CategoryItem>): Promise<string> {
    return new Promise(resolve => {
      if (categoryItem.key) {
        this.firebase.list('item').update(categoryItem.key, categoryItem.value);
        resolve('');
      } else {
        const newRef = this.firebase.list('item').push(categoryItem.value);
        const newKey = newRef.key;
        resolve(newKey);
      }
    });
  }
}

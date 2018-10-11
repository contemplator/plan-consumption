import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Category, CategoryItem, FirebaseObject } from '../../viewmodels';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryList: FirebaseObject<Category>[] = [];
  itemList: FirebaseObject<CategoryItem>[] = [];
  filtedItems: FirebaseObject<CategoryItem>[] = [];
  selectedCategory: FirebaseObject<Category> = { key: '', value: new Category() };
  selectedItem: FirebaseObject<CategoryItem> = { key: '', value: new CategoryItem() };
  curEdit: number = 0;      // 1: category, 2: categoryItem

  constructor(
    private service: AppService
  ) { }

  ngOnInit() {
    this.fetchCategoryList();
    this.fetchCategoryItemList();
  }

  /**
   * 取得分類列表
   */
  fetchCategoryList(): void {
    this.service.fetchCategoryList().subscribe(res => {
      this.categoryList = res.map(item => {
        return {
          key: item.key,
          value: item.payload.val()
        };
      });
      this.categoryList.push({
        key: '',
        value: { id: 0, name: '新增分類' }
      });

      if (this.categoryList.length > 0 && this.itemList.length > 0) {
        this.onCategoryClick({ value: this.categoryList[0] });
        this.onItemClick({ value: this.filtedItems[0] });
      }
    });
  }

  /**
   * 取得分類項目對應列表
   */
  fetchCategoryItemList(): void {
    this.service.fetchCategoryItemList().subscribe(res => {
      this.itemList = res.map(item => {
        return {
          key: item.key,
          value: item.payload.val()
        };
      });

      if (this.categoryList.length > 0 && this.itemList.length > 0) {
        this.onCategoryClick({ value: this.categoryList[0] });
        this.selectedCategory = this.categoryList[0];
        this.onItemClick({ value: this.filtedItems[0] });
        this.selectedItem = this.filtedItems[0];
      }
    });
  }

  /**
   * 點選分類列表某個分類
   * @param category
   */
  onCategoryClick(event): void {
    const category: FirebaseObject<Category> = event.value;
    // this.selectedCategory = category;
    if (category.value.id === 0) {
      this.selectedCategory.value.name = '';
    }
    this.curEdit = 1;
    this.filtedItems = this.itemList
      .filter(item => item.value.categoryId === category.value.id)
      .filter(item => item.value.deleted !== true);

    this.filtedItems.push({
      key: '',
      value: {
        id: 0,
        name: category.value.id !== 0 ? '新增分類項目' : '請先完成新增分類',
        categoryId: category.value.id,
        categoryName: category.value.name,
        deleted: false
      }
    });
  }

  /**
   * 點選分類項目
   * @param item
   */
  onItemClick(event): void {
    const item: FirebaseObject<CategoryItem> = event.value;
    if (item.value.categoryId === 0) {
      this.selectedItem = { key: '', value: new CategoryItem() };
      return;
    }

    this.curEdit = 2;
    if (item.value.id === 0) {
      this.selectedItem.value.name = '';
    }
  }

  /**
   * 新增或修改分類
   */
  onSetCategoryClick(): void {
    if (!this.selectedCategory.key) {
      const nextId = this.getNextCategoryId();
      this.selectedCategory.value.id = nextId;
    }
    this.service.setCategory(this.selectedCategory);
  }

  /**
   * 新增或修改分類項目
   */
  onSetItemClick(): void {
    if (!this.selectedItem.key) {
      const nextId = this.getNextItemId();
      this.selectedItem.value.id = nextId;
    }
    this.service.setCategoryItem(this.selectedItem).then(res => {
      if (res) {
        this.selectedItem.key = res;
        this.itemList.push(this.selectedItem);
        this.onCategoryClick(this.selectedCategory);
      }
    });
  }

  /**
   * 停用
   * 選擇新增分類
   */
  onAddCategoryClick(): void {
    this.curEdit = 1;
    this.selectedCategory = { key: '', value: new Category() };
  }

  /**
   * 選擇新增分類項目
   */
  onAddItemClick(): void {
    this.curEdit = 2;
    this.selectedItem = { key: '', value: new CategoryItem() };
    this.selectedItem.value.categoryId = this.selectedCategory.value.id;
    this.selectedItem.value.categoryName = this.selectedCategory.value.name;
  }

  /**
   * 刪除分類
   */
  onDeleteCategoryClick(): void {

  }

  /**
   * 刪除分類項目
   */
  onDeleteItemClick(): void {

  }

  /**
   * 取得分類的下一個流水號
   */
  getNextCategoryId(): number {
    const lastId = this.categoryList.reduce((pre, cur) => {
      pre = cur.value.id > pre ? cur.value.id : pre;
      return pre;
    }, 0);
    return lastId + 1;
  }

  /**
   * 取得分類項目的下一個流水號
   */
  getNextItemId(): number {
    const lastId = this.itemList.reduce((pre, cur) => {
      pre = cur.value.id > pre ? cur.value.id : pre;
      return pre;
    }, 0);
    return lastId + 1;
  }
}


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
    this.service.fetchCategoryList().subscribe(res => {
      this.categoryList = res.map(item => {
        return {
          key: item.key,
          value: item.payload.val()
        };
      });
      this.selectedCategory = this.categoryList[0];
    });
    this.service.fetchCategoryItemList().subscribe(res => {
      this.itemList = res.map(item => {
        return {
          key: item.key,
          value: item.payload.val()
        };
      });
    });
  }

  /**
   * 點選分類列表某個分類
   * @param category
   */
  onCategoryClick(category: FirebaseObject<Category>): void {
    this.selectedCategory = category;
    this.curEdit = 1;
    this.filtedItems = this.itemList
      .filter(item => item.value.categoryId === category.value.id)
      .filter(item => item.value.deleted !== true);
  }

  /**
   * 點選分類項目
   * @param item
   */
  onItemClick(item: FirebaseObject<CategoryItem>): void{
    this.selectedItem = item;
    this.curEdit = 2;
  }

  /**
   * 新增或修改分類
   */
  onSetCategoryClick(): void{
    if(!this.selectedCategory.key){
      const nextId = this.getNextCategoryId();
      this.selectedCategory.value.id = nextId;
    }
    this.service.setCategory(this.selectedCategory);
  }

  /**
   * 新增或修改分類項目
   */
  onSetItemClick(): void{
    if(!this.selectedItem.key){
      const nextId = this.getNextItemId();
      this.selectedItem.value.id = nextId;
    }
    this.service.setCategoryItem(this.selectedItem).then(res=>{
      if(res){
        this.selectedItem.key = res;
        this.itemList.push(this.selectedItem);
        this.onCategoryClick(this.selectedCategory);
      }
    });
  }

  /**
   * 選擇新增分類
   */
  onAddCategoryClick(): void{
    this.curEdit = 1;
    this.selectedCategory = { key: '', value: new Category() };
  }

  /**
   * 選擇新增分類項目
   */
  onAddItemClick(): void{
    this.curEdit = 2;
    this.selectedItem = { key: '', value: new CategoryItem() };
    this.selectedItem.value.categoryId = this.selectedCategory.value.id;
    this.selectedItem.value.categoryName = this.selectedCategory.value.name;
  }

  /**
   * 刪除分類
   */
  onDeleteCategoryClick(): void{

  }

  /**
   * 刪除分類項目
   */
  onDeleteItemClick(): void{

  }

  /**
   * 取得分類的下一個流水號
   */
  getNextCategoryId(): number{
    const lastId = this.categoryList.reduce((pre, cur)=>{
      pre = cur.value.id > pre ? cur.value.id : pre;
      return pre;
    }, 0);
    return lastId + 1;
  }

  /**
   * 取得分類項目的下一個流水號
   */
  getNextItemId(): number{
    const lastId = this.itemList.reduce((pre, cur)=>{
      pre = cur.value.id > pre ? cur.value.id : pre;
      return pre;
    }, 0);
    return lastId + 1;
  }
}


import { Category, CategoryItem } from './category';

export class SpendRecord {
  datetime: string;
  price: number;
  category: Category;
  item: CategoryItem;
  remark: string;
  date: string;
  time: string;
  key?: string;

  constructor() {
    const today = new Date();
    this.datetime = today.toFormatString('YYYY-MM-DD hh:mm:ss');
    this.datetime = this.datetime.substring(0, 10) + 'T' + this.datetime.substring(11, 19);
    this.price = null;
    this.category = new Category();
    this.item = new CategoryItem();
    this.remark = '';
    this.date = today.toFormatString('YYYY-MM-DD');
    this.time = today.toFormatString('hh:mm');
  }
}

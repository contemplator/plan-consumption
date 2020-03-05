export class Category {
  id: number;
  name: string;

  constructor() {
    this.id = 0;
    this.name = '';
  }
}

export class CategoryItem {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  deleted?: boolean;

  constructor() {
    this.id = 0;
    this.name = '';
    this.categoryId = 0;
    this.categoryName = '';
  }
}

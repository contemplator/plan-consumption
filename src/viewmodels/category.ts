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

export const CategoryList = [
  {
    'id': 1,
    'name': '飲食'
  },
  {
    'id': 2,
    'name': '衣物'
  },
  {
    'id': 3,
    'name': '居住'
  },
  {
    'id': 4,
    'name': '交通'
  },
  {
    'id': 5,
    'name': '教育'
  },
  {
    'id': 6,
    'name': '娛樂'
  },
  {
    'id': 7,
    'name': '其他'
  },
  {
    'id': 8,
    'name': '收入'
  },
];

export class FirebaseObject<T> {
  key: string;
  value: T;
}

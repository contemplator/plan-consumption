import { Category, CategoryItem } from './category';

export class SpendRecord {
  datetime: string;       // 時間，格式：yyyy/MM/dd hh:mm:ss
  price: number;          // 金額
  category: Category;     // 母分類
  item: CategoryItem;     // 子分類
  remark: string;         // 備註
  date: string;           // 日期，格式：yyyy/MM/dd
  time: string;           // 時間，格式：hh:mm:ss
  key: string;            // data key，編輯用

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
    this.key = '';
  }
}

export class SpendRecordMonth {
  records: SpendRecord[];             // 交易紀錄
  yearMonth: string;                  // 年月
  cost: number;                       // 總金額
  costWithoutInvest: number;          // 總金額扣除投資

  /**
   * 依照年月分組的交易紀錄
   * @param records 交易紀錄
   * @param yearMonth 年月
   * @param cost 總金額
   * @param costWithoutInvest 總金額扣除投資
   */
  constructor(records: SpendRecord[], yearMonth: string, cost: number, costWithoutInvest: number) {
    this.records = records;
    this.yearMonth = yearMonth;
    this.cost = cost;
    this.costWithoutInvest = costWithoutInvest;
  }
}

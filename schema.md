### https://apiblueprint.org/documentation/mson/tutorial.html

# Category

+ id (number) - 流水號
+ name (string) - 名稱

# Item

+ categoryId (number) - 母分類流水號
+ categoryName (string) - 母分類名稱
+ id (number) - 子分類流水號
+ name (string) - 子分類名稱

# Record

- category (Category) - 母分類
- datetime (string) - 時間，格式：yyyy/MM/dd hh:mm:ss
- date (string) - 日期，格式：yyyy/MM/dd
- time (string) - 時間，格式：hh:mm:ss
- item (Category) - 子分類
- price (number) - 金額
- remark (string) - 備註
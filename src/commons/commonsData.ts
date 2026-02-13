export interface BookItem {
  isbn: string;
  title: string;
  poster: string;
  author: string;
  price: number;
}

export interface MainPageData {
  main: BookItem;
  newList: BookItem[];
  hitList: BookItem[];
}
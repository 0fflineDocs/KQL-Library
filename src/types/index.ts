export interface Query {
  title: string;
  description: string;
  query: string;
  category: string;
  subCategory?: string;
  tags?: string[];
}

export interface CategoryInfo {
  displayName: string;
  textColor: string;
}

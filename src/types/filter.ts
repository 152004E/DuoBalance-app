export type FilterCategory = 'all' | 'personal' | 'couple' | 'group';

export interface FilterState {
  category: FilterCategory;
  groupId: string | null;
}
import { atom } from 'jotai';
import { FiltersParams } from 'src/types';

export const mapVisibleAtom = atom(true);

export const paginationParamsAtom = atom({
  pageIndex: 0,
  pageSize: 10,
});

export const filtersAtom = atom<FiltersParams>({});

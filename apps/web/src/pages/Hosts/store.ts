import { atom } from 'jotai';

export const mapVisibleAtom = atom(true);

export const paginationParamsAtom = atom({
  pageIndex: 0,
  pageSize: 20,
});

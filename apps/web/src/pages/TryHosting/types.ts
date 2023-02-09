import { Host } from 'src/types';

export type CreateHostDto = Pick<Host, 'firstName' | 'lastName' | 'aboutMe' | 'occupation'> & {
  profile: File;
};

import { Branch } from '../Branch';
import { Tree } from '../Tree';

export interface IChildren {
  parent: Branch | Tree | null;
}

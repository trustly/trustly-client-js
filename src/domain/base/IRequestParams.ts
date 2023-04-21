import {IData} from './IData';

export interface IRequestParams<D extends IData> {

  signature: string;

  uuid: string;

  data: D;

  withSignature(value: string): this;
}

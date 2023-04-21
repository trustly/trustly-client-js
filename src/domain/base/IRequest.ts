import {IRequestParams} from './IRequestParams';
import {IData} from './IData';

export interface IRequest<P extends IRequestParams<IData>> {

  method: string;

  version: number;

  params: P;
}

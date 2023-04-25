import {IRequestParamsData} from './IRequestParamsData';
import {IRequestParams} from './IRequestParams';

export interface JsonRpcRequest<D extends IRequestParamsData> {

  readonly method: string;
  readonly params: IRequestParams<D>;
  readonly version: '1.1' | string;
}

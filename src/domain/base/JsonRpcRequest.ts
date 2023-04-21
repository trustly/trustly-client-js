import {IRequestParamsData} from './IRequestParamsData';
import {IRequestParams} from './IRequestParams';

export class JsonRpcRequest<D extends IRequestParamsData>  {

  public readonly method: string;
  public readonly params: IRequestParams<D>;
  public readonly version: number;

  constructor(method: string, params: IRequestParams<D>, version: number) {
    this.method = method;
    this.params = params;
    this.version = version;
  }
}

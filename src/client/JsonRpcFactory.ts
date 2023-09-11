import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {IRequestParamsData} from '../domain/base/IRequestParamsData';
import * as u from 'uuid';
import {WithoutSignature} from '../domain/base/modifiers/WithoutSignature';

export class JsonRpcFactory {

  public create<D extends IRequestParamsData>(requestData: D, method: string, uuid?: string): WithoutSignature<JsonRpcRequest<D>> {

    if (!uuid) {
      uuid = u.v4().toString();
    }

    return {
      method: method,
      version: '1.1',
      params: {
        uuid: uuid,
        data: requestData,
      },
    };
  }
}

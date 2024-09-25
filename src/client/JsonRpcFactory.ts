import * as u from 'uuid';
import {WithoutSignature} from '../domain/WithoutSignature';
import {AbstractRequestData, AbstractRequestDataAttributes, JsonRpcRequest, JsonRpcRequestParams} from "../domain/models";

export class JsonRpcFactory {

  public create<M extends string, D extends AbstractRequestData<AbstractRequestDataAttributes>>(requestData: D, method: M, uuid?: string): WithoutSignature<JsonRpcRequest<JsonRpcRequestParams<D>, M>> {

    if (!uuid) {
      uuid = u.v4().toString();
    }

    return {
      method: method,
      version: '1.1',
      params: {
        UUID: uuid,
        Data: requestData,
      },
    };
  }
}

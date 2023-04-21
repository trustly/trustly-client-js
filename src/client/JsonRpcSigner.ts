import {IRequestParamsData} from '../domain/base/IRequestParamsData';
import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {IResponseResultData} from '../domain/base/IResponseResultData';
import {JsonRpcResponse} from '../domain/base/JsonRpcResponse';
import {IRequestParams} from '../domain/base/IRequestParams';
import {IRequest} from '../domain/base/IRequest';

export interface JsonRpcSigner {

  sign<T extends IRequestParamsData>(request: JsonRpcRequest<T> | null): JsonRpcRequest<T>;

  sign<T extends IResponseResultData>(response: JsonRpcResponse<T> | null): JsonRpcResponse<T>;

  verify<D extends IRequestParamsData, P extends IRequestParams<D>>(request: IRequest<P> | null): void;

  verify<T extends IResponseResultData>(response: JsonRpcResponse<T> | null, nodeResponse: Object | null): void;
}

import {IRequestParamsData} from '../domain/base/IRequestParamsData';
import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {IResponseResultData} from '../domain/base/IResponseResultData';
import {JsonRpcResponse} from '../domain/base/JsonRpcResponse';
import {IRequestParams} from '../domain/base/IRequestParams';
import {IRequest} from '../domain/base/IRequest';
import {WithoutSignature} from '../domain/base/modifiers/WithoutSignature';
import {NotificationRequest} from "../domain/base/NotificationRequest";

export interface JsonRpcSigner {

  signRequest<D extends IRequestParamsData, T extends JsonRpcRequest<D>>(request: WithoutSignature<T>): JsonRpcRequest<D>;

  signResponse<D extends IResponseResultData, T extends JsonRpcResponse<D>>(response: WithoutSignature<T>): JsonRpcResponse<D>;

  verifyRequest<D extends IRequestParamsData, P extends IRequestParams<D>>(request: IRequest<P>): void;

  verifyNotificationRequest<D extends IRequestParamsData>(request: NotificationRequest<D>): void;

  verifyResponse<T extends IResponseResultData>(response?: JsonRpcResponse<T>): void;
}

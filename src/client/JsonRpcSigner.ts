import {WithoutSignature} from '../domain/WithoutSignature';
import {
  AbstractRequestData,
  AbstractRequestDataAttributes, JsonRpcErrorResponse, JsonRpcNotification, JsonRpcNotificationParams,
  JsonRpcRequest,
  JsonRpcRequestParams,
  JsonRpcResponse,
  ResponseResult
} from "../domain/models";

export interface JsonRpcSigner {

  signRequest<TReqData extends AbstractRequestData<AbstractRequestDataAttributes>, M extends string>(request: WithoutSignature<JsonRpcRequest<JsonRpcRequestParams<TReqData>, M>>): JsonRpcRequest<JsonRpcRequestParams<TReqData>, M>;

  signResponse<TResData, M extends string>(response: WithoutSignature<JsonRpcResponse<ResponseResult<TResData, M>>>): JsonRpcResponse<ResponseResult<TResData, M>>;
  signErrorResponse(response: WithoutSignature<JsonRpcErrorResponse>): JsonRpcErrorResponse;

  verifyRequest<M extends string, D extends AbstractRequestData<AbstractRequestDataAttributes>, P extends JsonRpcRequestParams<D>>(request: JsonRpcRequest<P, M>): void;

  verifyNotificationRequest<M extends string, D, P extends JsonRpcNotificationParams<D>>(request: JsonRpcNotification<P, M>): void;

  verifyResponse<M extends string, D, TRes extends ResponseResult<D, M>>(response?: JsonRpcResponse<TRes>): void;
  verifyErrorResponse(response?: JsonRpcErrorResponse): void;
}

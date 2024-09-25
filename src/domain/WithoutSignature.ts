/* eslint-disable @typescript-eslint/no-explicit-any */

import {JsonRpcRequest, JsonRpcRequestParams, JsonRpcResponse, ResponseResult} from "./models";

export type WithoutSignature<T> =
  T extends JsonRpcRequest<infer TParams, any>
    ? (Omit<T, 'params'> & { params: WithoutSignature<TParams> })
    : T extends JsonRpcRequestParams<any>
      ? Omit<T, 'Signature'>
      : T extends JsonRpcResponse<infer TRes>
        ? (Omit<T, 'result'> & { result: WithoutSignature<TRes> })
        : T extends ResponseResult<any, any>
          ? Omit<T, 'signature'>
          : T;

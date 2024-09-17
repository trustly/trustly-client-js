import {TrustlyApiClientSettingsData} from './TrustlyApiClientSettings';
import {Serializer} from './Serializer';
import {JsonRpcSigner} from './JsonRpcSigner';
import {TrustlyStringUtils} from '../util/TrustlyStringUtils';
import {WithoutSignature} from '../domain/WithoutSignature';
import * as crypto from 'crypto';
import {
  AbstractRequestData,
  AbstractRequestDataAttributes,
  JsonRpcErrorResponse,
  JsonRpcNotification,
  JsonRpcNotificationParams,
  JsonRpcRequest,
  JsonRpcRequestParams,
  JsonRpcResponse,
  ResponseResult
} from "../domain/models";

export class DefaultJsonRpcSigner implements JsonRpcSigner {

  private readonly serializer: Serializer;
  private readonly settings: TrustlyApiClientSettingsData;

  public constructor(serializer: Serializer, settings: TrustlyApiClientSettingsData) {
    this.serializer = serializer;
    this.settings = settings;
  }

  public createPlaintext(serializedData: string, method: string, uuid: string): string {
    return `${method}${uuid}${serializedData}`;
  }

  public signRequest<TReqData extends AbstractRequestData<AbstractRequestDataAttributes>, M extends string>(v: WithoutSignature<JsonRpcRequest<JsonRpcRequestParams<TReqData>, M>>): JsonRpcRequest<JsonRpcRequestParams<TReqData>, M> {

    const signature = this.createSignature(v.method, v.params.UUID, v.params.Data);

    return {
      ...v,
      params: {
        ...v.params,
        Signature: signature,
      },
    };
  }

  public signResponse<TResData, M extends string>(response: WithoutSignature<JsonRpcResponse<ResponseResult<TResData, M>>>): JsonRpcResponse<ResponseResult<TResData, M>> {

    if (response.result) {
      const signature = this.createSignature(response.result.method, response.result.uuid, response.result.data as object);
      return {
        ...response,
        result: {
          ...response.result,
          signature: signature,
        }
      };

    } else {
      throw new Error(`There must be either a result or an error`);
    }
  }

  public signErrorResponse(response: WithoutSignature<JsonRpcErrorResponse>): JsonRpcErrorResponse {

    const error = response.error.error!;
    const signature = this.createSignature(error.method, error.uuid, error.data);
    return {
      ...response,
      error: {
        ...response.error,
        error: {
          ...error,
          signature: signature,
        },
      },
    };
  }

  private createSignature<T extends object>(method: string, uuid: string, data: T): string {
    const serializedData = this.serializer.serializeData(data);
    const plainText = this.createPlaintext(serializedData, method, uuid);

    const sign = crypto.createSign('RSA-SHA1'); // RSA-SHA256
    sign.update(plainText);  // data from your file would go here
    return sign.sign(this.settings.clientPrivateKey, 'base64');
  }

  verifyRequest<M extends string, D extends AbstractRequestData<AbstractRequestDataAttributes>, P extends JsonRpcRequestParams<D>>(request: JsonRpcRequest<P, M>): void {

    const uuid = request.params?.UUID as string;
    const signature = request.params?.Signature as string;
    const data = request.params?.Data as object;

    this.verify(request.method, uuid, signature, data);
  }

  verifyNotificationRequest<M extends string, D, P extends JsonRpcNotificationParams<D>>(request: JsonRpcNotification<P, M>): void {

    const uuid = request.params?.uuid as string;
    const signature = request.params?.signature as string;
    const data = request.params?.data as object;

    this.verify(request.method, uuid, signature, data);
  }

  public verifyResponse<M extends string, D, TRes extends ResponseResult<D, M>>(response?: JsonRpcResponse<TRes>): void {

    const method = response?.result.method;
    const uuid = response?.result.uuid;
    const signature = response?.result.signature;
    const data = response?.result.data;

    if (!method || !uuid || !signature || !data) {
      throw new Error(`Missing the method, uuid, signature or data from the response`);
    }

    this.verify(method, uuid, signature, data);
  }

  public verifyErrorResponse(response?: JsonRpcErrorResponse): void {

    const error = response?.error?.error as Record<string, unknown>;
    const method = error.method as string;
    const uuid = error.uuid as string;
    const signature =  error.signature as string;
    const data = error.data as object;

    if (!method || !uuid || !signature || !data) {
      throw new Error(`Missing the method, uuid, signature or data from the response`);
    }

    this.verify(method, uuid, signature, data);
  }

  private verify(method: string, uuid: string, expectedSignature: string, data: object, dataNode?: Record<string, unknown>): void {

    if (TrustlyStringUtils.isBlank(expectedSignature)) {
      throw new Error('There was no expected signature given. The payload seems malformed');
    }

    // If possible, we will serialize based on the actual data node instead of the data object.
    // This way we can differentiate between a field that has as null value and was not given at all.
    // This can happen with values given back from the Trustly remote server.
    const serializedResponseData: string = dataNode
      ? this.serializer.serializeNode(dataNode)
      : this.serializer.serializeData(data);

    const responsePlainText = this.createPlaintext(serializedResponseData, method, uuid);

    const verify = crypto.createVerify('RSA-SHA1'); // RSA-SHA256
    verify.update(responsePlainText, 'utf-8');

    if (!verify.verify(this.settings.trustlyPublicKey, expectedSignature, 'base64')) {
      throw new Error(`Could not verify the response`);
    }
  }
}

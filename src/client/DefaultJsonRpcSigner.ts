import {TrustlyApiClientSettingsData} from './TrustlyApiClientSettings';
import {Serializer} from './Serializer';
import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {IRequestParamsData} from '../domain/base/IRequestParamsData';
import {JsonRpcResponse} from '../domain/base/JsonRpcResponse';
import {IResponseResultData} from '../domain/base/IResponseResultData';
import {JsonRpcSigner} from './JsonRpcSigner';
import {IData} from '../domain/base/IData';
import {IRequest} from '../domain/base/IRequest';
import {IRequestParams} from '../domain/base/IRequestParams';
import {TrustlyStringUtils} from '../util/TrustlyStringUtils';
import {WithoutSignature} from '../domain/base/modifiers/WithoutSignature';
import * as crypto from 'crypto';
import {NotificationRequest} from "../domain/base/NotificationRequest";

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

  public signRequest<D extends IRequestParamsData, T extends JsonRpcRequest<D>>(v: WithoutSignature<T>): JsonRpcRequest<D> {

    const signature = this.createSignature(v.method, v.params.UUID, v.params.Data);

    return {
      ...v,
      params: {
        ...v.params,
        Signature: signature,
      },
    };
  }

  public signResponse<D extends IResponseResultData, T extends JsonRpcResponse<D> = JsonRpcResponse<D>>(response: WithoutSignature<T>): JsonRpcResponse<D> {

    if (response.result) {
      const signature = this.createSignature(response.result.method, response.result.uuid, response.result.data);
      return {
        ...response,
        result: {
          ...response.result,
          signature: signature,
        }
      };

    } else if (response.error && response.error.error) {
      const signature = this.createSignature(response.error.error.method, response.error.error.uuid, response.error.error.data);
      return {
        ...response,
        error: {
          ...response.error,
          error: {
            ...response.error.error,
            signature: signature,
          },
        },
      };
    } else {
      throw new Error(`There must be either a result or an error`);
    }
  }

  private createSignature<T extends IData>(method: string, uuid: string, data: T): string {
    const serializedData = this.serializer.serializeData(data);
    const plainText = this.createPlaintext(serializedData, method, uuid);

    const sign = crypto.createSign('RSA-SHA1'); // RSA-SHA256
    sign.update(plainText);  // data from your file would go here
    return sign.sign(this.settings.clientPrivateKey, 'base64');
  }

  public verifyRequest<D extends IRequestParamsData, P extends IRequestParams<D>>(request: IRequest<P>): void {

    const uuid = request.params.UUID;
    const signature = request.params.Signature;
    const data = request.params.Data;

    this.verify(request.method, uuid, signature, data);
  }

  public verifyNotificationRequest<D extends IRequestParamsData>(request: NotificationRequest<D>): void {

    const uuid = request.params.uuid;
    const signature = request.params.signature;
    const data = request.params.data;

    this.verify(request.method, uuid, signature, data);
  }

  public verifyResponse<T extends IResponseResultData>(response: JsonRpcResponse<T>): void {

    const method = response.result ? response.result.method : response.error?.error?.method;
    const uuid = response.result ? response.result.uuid : response.error?.error?.uuid;
    const signature = response.result ? response.result.signature : response.error?.error?.signature;
    const data = response.result ? response.result.data : response.error?.error?.data;

    if (!method || !uuid || !signature || !data) {
      throw new Error(`Missing the method, uuid, signature or data from the response`);
    }

    this.verify(method, uuid, signature, data);
  }

  private verify(method: string, uuid: string, expectedSignature: string, data: IData, dataNode?: Record<string, unknown>): void {

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

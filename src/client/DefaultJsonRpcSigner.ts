import {java, S} from 'jree';
import {TrustlyApiClientSettings} from './TrustlyApiClientSettings';
import {Serializer} from './Serializer';
import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {IRequestParamsData} from '../domain/base/IRequestParamsData';
import {JsonRpcResponse} from '../domain/base/JsonRpcResponse';
import {IResponseResultData} from '../domain/base/IResponseResultData';
import {JsonRpcSigner} from './JsonRpcSigner';
import {IData} from '../domain/base/IData';

export class DefaultJsonRpcSigner implements JsonRpcSigner {

  public static readonly SHA1_WITH_RSA: string = 'SHA1withRSA';

  private readonly serializer: Serializer;
  private readonly settings: TrustlyApiClientSettings;

  public constructor(serializer: Serializer, settings: TrustlyApiClientSettings) {
    this.serializer = serializer;
    this.settings = settings;
  }

  public createPlaintext(serializedData: string, method: string, uuid: string): string {
    return `${method}${uuid}${serializedData}`;
  }

  public sign<T extends IRequestParamsData>(request: JsonRpcRequest<T> | null): JsonRpcRequest<T> | null;

  public sign<T extends IResponseResultData>(response: JsonRpcResponse<T> | null): JsonRpcResponse<T> | null;
  public sign<T extends IRequestParamsData>(...args: unknown[]): JsonRpcRequest<T> | JsonRpcResponse<T> {
    switch (args.length) {
      case 1: {
        const [request] = args as [JsonRpcRequest<T>];


        const signature: string = this.createSignature(request.getMethod(), request.getParams().getUuid(), request.getParams().getData());

        return request.toBuilder()
          .params(
            request.getParams().withSignature(signature),
          )
          .build();


        break;
      }

      case 1: {
        const [response] = args as [JsonRpcResponse<T>];


        const signature: string = this.createSignature(response.getMethod(), response.getUUID(), response.getData());

        return response.toBuilder()
          .result(
            response.getResult().toBuilder()
              .signature(signature)
              .build(),
          )
          .build();


        break;
      }

      default: {
        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
      }
    }
  }


  private createSignature<T extends IData>(method: string | null, uuid: string | null, data: T | null): string | null {
    const serializedData: string = this.serializer.serializeData(data);
    const plainText: string = this.createPlaintext(serializedData, method, uuid);

    let signer: java.security.Signature;
    try {
      signer = java.security.Signature.getInstance(DefaultJsonRpcSigner.SHA1_WITH_RSA, BouncyCastleProvider.PROVIDER_NAME);
    } catch (ex) {
      if (ex instanceof java.security.NoSuchAlgorithmException) {
        throw new java.lang.IllegalArgumentException('Could not find signing algorithm. Has BouncyCastle not been initialized?', ex);
      } else if (ex instanceof java.security.NoSuchProviderException) {
        throw new java.lang.IllegalArgumentException('Could not find provider. Has BouncyCastle not been initialized?', ex);
      } else {
        throw ex;
      }
    }

    try {
      signer.initSign(this.settings.getClientPrivateKey());
    } catch (e) {
      if (e instanceof java.security.InvalidKeyException) {
        throw new java.lang.IllegalArgumentException('Could not sign using given client private key', e);
      } else {
        throw e;
      }
    }

    const plainBytes: Int8Array = plainText.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    let signedBytes: Int8Array;

    try {
      signer.update(plainBytes);
      signedBytes = signer.sign();
    } catch (e) {
      if (e instanceof java.security.SignatureException) {
        throw new java.lang.IllegalArgumentException(string.format('Could not create signature for method %s', method), e);
      } else {
        throw e;
      }
    }

    return java.util.Base64.getEncoder().encodeToString(signedBytes);
  }

  public verify<D extends IRequestParamsData, P extends IRequestParams<D>>(request: IRequest<P> | null): void;

  public verify<T extends IResponseResultData>(response: JsonRpcResponse<T> | null, nodeResponse: JsonNode | null): void;

  private verify(method: string | null, uuid: string | null, expectedSignature: string | null, data: IData | null, dataNode: JsonNode | null): void;
  public verify<D extends IRequestParamsData, P extends IRequestParams<D>>(...args: unknown[]): void {
    switch (args.length) {
      case 1: {
        const [request] = args as [IRequest<P>];


        const uuid: string = (request.getParams() === null) ? null : request.getParams().getUuid();
        const signature: string = (request.getParams() === null) ? null : request.getParams().getSignature();
        const data: D = (request.getParams() === null) ? null : request.getParams().getData();

        this.verify(request.getMethod(), uuid, signature, data, null);


        break;
      }

      case 2: {
        const [response, nodeResponse] = args as [JsonRpcResponse<T>, JsonNode];


        let dataNode: JsonNode = null;
        if (nodeResponse !== null) {
          dataNode = nodeResponse.at('/result/data');
          if (dataNode.isMissingNode()) {
            dataNode = nodeResponse.at('/error/data');
          }
        }

        this.verify(response.getMethod(), response.getUUID(), response.getSignature(), response.getData(), dataNode);


        break;
      }

      case 5: {
        const [method, uuid, expectedSignature, data, dataNode] = args as [string, string, string, IData, JsonNode];


        if (TrustlyStringUtils.isBlank(expectedSignature)) {
          throw new java.lang.IllegalArgumentException('There was no expected signature given. The payload seems malformed');
        }

        // If possible, we will serialize based on the actual data node instead of the data object.
        // This way we can differentiate between a field that has as null value and was not given at all.
        // This can happen with values given back from the Trustly remote server.
        const serializedResponseData: string = (dataNode !== null && !dataNode.isMissingNode() && !dataNode.isNull())
          ? this.serializer.serializeNode(dataNode)
          : this.serializer.serializeData(data);

        const responsePlainText: string = this.createPlaintext(serializedResponseData, method, uuid);

        const responseBytes: Int8Array = responsePlainText.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        const expectedSignatureBytes: Int8Array = java.util.Base64.getDecoder().decode(expectedSignature);

        try {

          if (java.security.Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) === null) {
            java.security.Security.addProvider(new BouncyCastleProvider());
          }

          const signer: java.security.Signature = java.security.Signature.getInstance(DefaultJsonRpcSigner.SHA1_WITH_RSA, BouncyCastleProvider.PROVIDER_NAME);
          signer.initVerify(this.settings.getTrustlyPublicKey());
          signer.update(responseBytes);

          if (!signer.verify(expectedSignatureBytes)) {
            throw new TrustlySignatureException(
              string.format('Could not verify signature \'%s\' of message \'%s\' with method \'%s\'', expectedSignature, uuid, method));
          }
        } catch (e) {
          if (e instanceof java.security.NoSuchAlgorithmException) {
            throw new java.lang.IllegalArgumentException('Could not find the algorithm, has BouncyCastle not been initialized?', e);
          } else if (e instanceof java.security.NoSuchProviderException) {
            throw new java.lang.IllegalArgumentException('Could not find the security provider, has BouncyCastle not been initialized?', e);
          } else if (e instanceof java.security.SignatureException) {
            throw new java.lang.IllegalArgumentException('Could not update the signature with the given response bytes', e);
          } else if (e instanceof java.security.InvalidKeyException) {
            throw new java.lang.IllegalArgumentException('Could not verify the data with the given Trustly public key', e);
          } else {
            throw e;
          }
        }


        break;
      }

      default: {
        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
      }
    }
  }

}

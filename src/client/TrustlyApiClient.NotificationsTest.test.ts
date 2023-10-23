import {describe} from "@jest/globals";
import {TrustlyApiClientSettings} from "./TrustlyApiClientSettings";

import cert_merchant_public from '../../resources/keys/merchant_public_key.pem';
import merchant_public_key from '../../resources/keys/merchant_public_key.pem';
import cert_merchant_private from '../../resources/keys/merchant_private_key.pem';
import {TrustlyApiClient} from "./TrustlyApiClient";
import {TrustlyApiClientExtensions} from "./TrustlyApiClientExtensions";
import {JsonRpcSigner} from "./JsonRpcSigner";
import {IData} from "../domain/base/IData";
import {IResponseResultData} from "../domain/base/IResponseResultData";
import {JsonRpcRequest} from "../domain/base/JsonRpcRequest";
import {JsonRpcResponse} from "../domain/base/JsonRpcResponse";
import {WithoutSignature} from "../domain/base/modifiers/WithoutSignature";

const cancelBody = {
  "method": "cancel",
  "params": {
    "signature": "MWwF9r4AJ9uiI33qYwt/6xMnq5X7EM3DdxDpcbAh4jD7UQV4UUfAWW85+2ff+luWoN07P81x4WOVSi6GoLi2oK7fGXzy7alfIgN67TS1ixblKeuZHsAPZXR4CEqcRSD9IUKJDph2yblMakMAqeBtdUKrGzzFfyf0iHEeZFk6tO0wly0SfiyW4N0T8sp2AcEJPaAl+hdNSveKa6vBhr6mybnznDo0HeoMhyzR7NOKVEO1xLy3AM9XatwIdkmUO7DEEvqqcILNoBFuSpv6vkjxeKBcF80+tQ2RACYMnArMlJbRWVwdv3ZZfYTmvZ0iapVm2p+05HlajjawfXfGCaJsVQ==",
    "uuid": "258a2184-9021-b874-21ca-293425152415",
    "data": {
      "messageid": "98348932",
      "orderid": "87654567",
      "enduserid": "32123",
      "notificationid": "4876513450",
      "timestamp": "2013-12-20 14:42:04.675645+01"
    }
  },
  "version": "1.1"
};

const unknownBody = {
  "method": "foo",
  "params": {
    "signature": "fVhjuMqbsH0Ku ... S16VbzRsw==",
    "uuid": "258a2184-2842-b485-23ca-293425152415",
    "data": {
      "something": "abc"
    }
  },
  "version": "1.1"
};

class NoOpJsonRpcSigner implements JsonRpcSigner {

  signRequest<D extends IData, T extends JsonRpcRequest<D>>(request: WithoutSignature<T>): JsonRpcRequest<D> {
    return {
      ...request,
      ...{
        params: {
          ...request.params,
          Signature: 'no-op signature',
        },
      },
    };
  }

  signResponse<D extends IResponseResultData, T extends JsonRpcResponse<D>>(response: WithoutSignature<T>): JsonRpcResponse<D> {
    if (response.result) {
      return {
        ...response,
        ...{
          result: {
            ...response.result,
            signature: 'no-op signature',
          },
        },
      };
    } else if (response.error?.error) {
      return {
        ...response,
        ...{
          error: {
            ...response.error,
            error: {
              ...response.error.error,
              signature: 'no-op signature',
            },
          },
        },
      };
    } else {
      throw new Error(`There must be at least a result or an error`);
    }
  }

  verifyRequest(): void {
    console.log(`no-op verifyRequest`);
  }

  verifyNotificationRequest(): void {
    console.log(`no-op verifyNotificationRequest`);
  }

  verifyResponse(): void {
    console.log(`no-op verifyResponse`);
  }
}

describe('notifications', () => {

  const settings = TrustlyApiClientSettings.forTest()
    .withCredentials("merchant_username", "merchant_password")
    // We use the same certificates as those found at https://test.trustly.com/signaturetester/
    .withCertificatesFromContent(cert_merchant_public, cert_merchant_private)
    .andTrustlyCertificateFromContent(merchant_public_key);

  test('testCancelNotification', async () => {

    const client = new TrustlyApiClient(settings);

    let receivedNotificationDataCounter = 0;

    client.addNotificationListener('cancel', (args) => {
      receivedNotificationDataCounter++;
      return args.respondWithOk();
    });

    const headers: Record<string, unknown> = {};
    let status = -1;
    let responseString: string | undefined = undefined;

    const cancelBodyString = JSON.stringify(cancelBody);

    await TrustlyApiClientExtensions.handleNotificationRequest(client, cancelBodyString, {
      addHeader(key: string, value: string) {
        headers[key] = value;
      },
      setStatus(httpStatus: number) {
        status = httpStatus;
      },
      writeBody(value: string) {
        responseString = value;
        return Promise.resolve();
      }
    });

    expect(receivedNotificationDataCounter).toEqual(1);
    expect(status).toEqual(200);
    expect(responseString).toBeDefined();
  });

  test('testUnknownNotification', async () => {

    const client = new TrustlyApiClient(settings, new NoOpJsonRpcSigner());

    let receivedUnknownValue: unknown = undefined;

    client.addNotificationListener('foo', (args) => {
      receivedUnknownValue = args.data['something'];
      return args.respondWithOk();
    });

    const headers: Record<string, unknown> = {};
    let status = -1;
    let responseString: string | undefined = undefined;

    const bodyString = JSON.stringify(unknownBody);

    await TrustlyApiClientExtensions.handleNotificationRequest(client, bodyString, {
      addHeader(key: string, value: string) {
        headers[key] = value;
      },
      setStatus(httpStatus: number) {
        status = httpStatus;
      },
      writeBody(value: string) {
        responseString = value;
        return Promise.resolve();
      }
    });

    expect(status).toEqual(200);
    expect(headers['Content-Type']).toEqual('application/json');
    expect(responseString).toBeDefined();
    expect(receivedUnknownValue).toEqual('abc');
  });
});


import {TrustlyApiClient} from "./TrustlyApiClient";
import {TrustlyApiClientSettings} from "./TrustlyApiClientSettings";
import * as uuid from 'uuid';
import express from 'express';
import {Server} from "http";
import {AddressInfo} from "net";
import {DepositRequestData, DepositResponseData} from "../domain/models";

// TODO:
// * Make the ApiClient into a Core client, and then add Method functions to it by using a union builder of some sorts
//    - This way it would be easy to extend the client with custom methods, and lessen the number of imports in client

const createInvalidRpcResponse = () => {

  const settings = TrustlyApiClientSettings
    .forTest()
    .withCredentialsFromUserHome()
    .withCertificatesFromUserHome()
    .andTrustlyCertificateTest();

  const client = new TrustlyApiClient(settings);

  const data: DepositResponseData = {
    orderid: '123',
    url: 'www.url.com',
  };

  const jsonRpc = client.createResponsePackage<DepositResponseData>('Deposit', uuid.v4(), data);

  if (jsonRpc.result) {
    jsonRpc.result.signature = '<wrong>';
  }

  return jsonRpc;
};

describe('requests', () => {

  const app = express();
  let server: Server | undefined = undefined;

  beforeEach(() => {

    app.post('/api/1/invalid', (_, res) => {
      res.status(200).json({foo: {bar: 'baz'}});
    });

    app.post('/api/1/invalid-signature', (_, res) => {
      res.status(200).json(createInvalidRpcResponse());
    });

    app.post('/api/1/empty', (_, res) => {
      res.status(200).json({});
    });

    server = app.listen();
    // server.listen();
  });

  afterEach(done => {
    if (server) {
      server.close(done);
      server = undefined;
    }
  });

  const body: DepositRequestData = {
    Username: 'Username',
    Password: 'Password',
    EndUserID: uuid.v4(),
    MessageID: uuid.v4(),
    NotificationURL: 'https://mock.trustly.com/notifications', // Optional
    Attributes: {
      FailURL: '',
      SuccessURL: '',
      Country: '',
      Lastname: '',
      Firstname: '',
      Currency: '',
      Locale: '',
      ShopperStatement: '',
      Email: '',
      MobilePhone: '',
    }
  };

  test('deposit-with-invalid-response', async () => {

    const address = server?.address() as AddressInfo;
    const hostname = (address.address == '::') ? '127.0.0.1' : address.address;

    const settings = TrustlyApiClientSettings
      .forCustom(`http://${hostname}:${address.port}/api/1/invalid`)
      .withCredentialsFromUserHome()
      .withCertificatesFromUserHome()
      .andTrustlyCertificateTest();

    const client = new TrustlyApiClient(settings);
    await expect(client.deposit(body)).rejects.toThrow(`Received an invalid response without known result from the Trustly API`);
  });

  test('deposit-with-empty-response', async () => {

    const address = server?.address() as AddressInfo;
    const hostname = (address.address == '::') ? '127.0.0.1' : address.address;

    const settings = TrustlyApiClientSettings
      .forCustom(`http://${hostname}:${address.port}/api/1/empty`)
      .withCredentialsFromUserHome()
      .withCertificatesFromUserHome()
      .andTrustlyCertificateTest();

    const client = new TrustlyApiClient(settings);
    await expect(client.deposit(body)).rejects.toThrow(`Received a no-result response from the Trustly API`);
  });

  test('deposit-with-invalid-response-signature', async () => {

    const address = server?.address() as AddressInfo;
    const hostname = (address.address == '::') ? '127.0.0.1' : address.address;

    const settings = TrustlyApiClientSettings
      .forCustom(`http://${hostname}:${address.port}/api/1/invalid-signature`)
      .withCredentialsFromUserHome()
      .withCertificatesFromUserHome()
      .andTrustlyCertificateTest();

    const client = new TrustlyApiClient(settings);
    await expect(client.deposit(body)).rejects.toThrow(`Could not verify the response`);
  });
});



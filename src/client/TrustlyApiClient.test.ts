import {TrustlyApiClient} from "./TrustlyApiClient";
import {TrustlyApiClientSettings} from "./TrustlyApiClientSettings";
import nock from 'nock';

// TODO:
// * Make the ApiClient into a Core client, and then add Method functions to it by using a union builder of some sorts
//    - This way it would be easy to extend the client with custom methods, and lessen the number of imports in client

describe('requests', () => {

  nock('https://localhost:1111')
    .post('/api/1')
    .reply(200, {
      foo: {
        bar: 'baz',
      },
    });

  test('deposit', () => {

    const settings = TrustlyApiClientSettings
      .forCustom("https://localhost:1111/api/1")
      .withCredentialsFromUserHome()
      .withCertificatesFromUserHome()
      .andTrustlyCertificateTest();

    const client = new TrustlyApiClient(settings);

    const response = client.deposit({
      // username: '', // Remove
      // password: '', // Remove
      endUserId: '',
      messageId: '',
      notificationUrl: '', // Optional
    });

    expect(response).toBeDefined();
  });
});



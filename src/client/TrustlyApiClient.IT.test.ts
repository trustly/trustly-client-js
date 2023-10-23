import {describe, expect} from "@jest/globals";
import {TrustlyApiClientSettings} from "./TrustlyApiClientSettings";
import {TrustlyApiClient} from "./TrustlyApiClient";
import * as uuid from 'uuid';
import {TrustlyErrorResponseException} from "../domain/exceptions/TrustlyErrorResponseException";

/**
 * These test will only work if a local environment exists. At the USER_HOME root these files is needed: trustly_client_username.txt - your
 * username trustly_client_password.txt - your password trustly_client_public.pem - your public key trustly_client_public.pem - your private
 * key
 * <p>
 * If those files exist and are correct you are able to make requests to Trustly's test environment
 */
describe('serialize', () => {

  const settings = TrustlyApiClientSettings.forTest()
    .withCredentialsFromUserHome()
    .withCertificatesFromUserHome()
    .andTrustlyCertificate();

  const client = new TrustlyApiClient(settings);

  test('testDeposit', async () => {

    const response = await client.deposit({
      NotificationURL: "https://fake.test.notification.trustly.com",
      EndUserID: "john.doe@trustly.com",
      MessageID: uuid.v4(),
      Attributes: {
        Currency: "EUR",
        Amount: "100.00",
        Firstname: "John",
        Lastname: "Doe",
        Email: "john.doe@trustly.com",
        Country: "SE",
        Locale: "sv_SE",
        ShopperStatement: "Trustly Test Deposit",
        SuccessURL: "https://google.com",
        FailURL: "https://google.com",
        MobilePhone: "0701234567",
      }
    });

    expect(response).toBeDefined();
    expect(response.url).toBeDefined();
  });

  test('testAccountPayout', async () => {
    // const client = new TrustlyApiClient(settings);

    const promise = client.accountPayout({
      AccountID: ("AccountID"),
      EndUserID: ("EndUserId"),
      MessageID: ("MessageId"),
      Amount: ("99.99"),
      Currency: ("SEK"),
      NotificationURL: ("https://notify.me"),
      Attributes: {
        PSPMerchant: ("Merchant Ltd."),
        ShopperStatement: ("MyBrand.com"),
        ExternalReference: ("23423525234"),
        MerchantCategoryCode: ("5499"),
        PSPMerchantURL: ("www.merchant.com"),
        SenderInformation: {
          Partytype: ("PERSON"),
          Address: ("Street 1, 12345 Barcelona"),
          CountryCode: ("SE"),
          Firstname: ("Steve"),
          Lastname: ("Smith"),
          CustomerID: ("123456789"),
          DateOfBirth: ("1990-03-31"),
        }
      }
    });

    try {
      await promise;
      fail(`Should have failed`);
    } catch (err) {

      if (err instanceof TrustlyErrorResponseException) {

        expect(err.cause).not.toBeDefined();
        expect(err.responseError).toBeDefined();
        expect(err.responseError?.code).toEqual(620);
        expect(err.responseError?.message).toEqual('ERROR_UNKNOWN');

      } else {
        throw new Error(`Should have been a Trustly error response`);
      }
    }
  });

});

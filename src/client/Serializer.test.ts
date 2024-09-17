import {describe, expect} from "@jest/globals";
import {Serializer} from "./Serializer";
import {JsonRpcFactory} from "./JsonRpcFactory";
import {TrustlyApiClient} from "./TrustlyApiClient";
import {TrustlyApiClientSettings} from "./TrustlyApiClientSettings";
import {DepositRequestData, RegisterAccountResponseData} from "../domain/models";

describe('serialize', () => {

  test('testSerializingDepositWithoutValidation', () => {

    const serializer = new Serializer();
    const factory = new JsonRpcFactory();

    const request: DepositRequestData = {
      Username: 'merchant_username',
      Password: 'merchant_password',
      NotificationURL: 'URL_to_your_notification_service',
      EndUserID: '12345',
      MessageID: 'your_unique_deposit_id',
      Attributes: {
        Locale: 'sv_SE',
        Country: 'SE',
        SuccessURL: 'success.com',
        FailURL: 'fail.com',
        Currency: 'SEK',
        IP: '123.123.123.123',
        MobilePhone: '+46709876543',
        Firstname: 'John',
        Lastname: 'Doe',
        NationalIdentificationNumber: '790131-1234',
        ShopperStatement: 'Text',
        Email: 'email@email.com'
      }
    };

    const jsonRpc = factory.create(request, "Deposit");

    const serialized = serializer.serializeData(jsonRpc.params.Data);
    const expected = "AttributesCountrySECurrencySEKEmailemail@email.comFailURLfail.comFirstnameJohnIP123.123.123.123LastnameDoeLocalesv_SEMobilePhone+46709876543NationalIdentificationNumber790131-1234ShopperStatementTextSuccessURLsuccess.comEndUserID12345MessageIDyour_unique_deposit_idNotificationURLURL_to_your_notification_servicePasswordmerchant_passwordUsernamemerchant_username";

    expect(serialized).toEqual(expected);
  });

  test('serializeResponseWithNonNullAnyMapAsPojo', () => {

    const data: RegisterAccountResponseData = {
      accountid: '123456789',
      bank: 'BankA',
      clearinghouse: 'SWEDEN',
    };

    const serializer = new Serializer();
    const serialized = serializer.serializeData(data);

    expect(serialized).toEqual('accountid123456789bankBankAclearinghouseSWEDEN');
  });

  test('serializeResponseWithNonNullAnyMapAsPojWithEmptyDescriptor', () => {

    const data: RegisterAccountResponseData = {
      accountid: '123456789',
      bank: 'BankA',
      clearinghouse: 'SWEDEN',
      descriptor: '',
    };

    const serializer = new Serializer();
    const serialized = serializer.serializeData(data);

    expect(serialized).toEqual('accountid123456789bankBankAclearinghouseSWEDENdescriptor');
  });

  test('serializeResponseWithNonEmptyAnyMapAsPOJO', () => {

    const data: RegisterAccountResponseData = {
      accountid: '123456789',
      bank: 'BankA',
      clearinghouse: 'SWEDEN',
      key: 'value',
    };

    const serializer = new Serializer();
    const serialized = serializer.serializeData(data);

    expect(serialized).toEqual("accountid123456789bankBankAclearinghouseSWEDENkeyvalue");
  });

  test('testNullProperties', () => {
    const serializer = new Serializer();

    const settings = TrustlyApiClientSettings
      .forTest()
      .withCredentials("merchant_username", "merchant_password")
      .withCertificatesFromFiles("resources/keys/merchant_public_key.pem", "resources/keys/merchant_private_key.pem")
      .andTrustlyCertificate();

    const client = new TrustlyApiClient(settings);

    const rpcResponse = client.createResponsePackage(
      "account",
      "e76ffbe5-e0f9-4402-8689-f868ed2021f8",
      {
        status: 'OK'
      },
    );

    const serialized = serializer.serializeData(rpcResponse.result?.data);
    expect(serialized).toEqual("statusOK");

    expect(rpcResponse.result?.signature).toEqual(
      "J28IN0yXZN3dlV2ikg4nQKwnP98kso8lzpmuwBcfbXr8i3XeEyydRM4jRwsOOeF0ilGuXyr1Kyb3+1j4mVtgU0SwjVgBHWrYPMegNeykY3meto/aoATH0mvop4Ex1OKO7w/S/ktR2J0J5Npn/EuiKGiVy5GztHYTh9hWmZBCElYPZf4Rsd1CJQJAPlZeAuRcrb5dnbiGJvTEaL/7VLcPT27oqAUefSNb/zNt5yL+wH6BihlkpZ/mtE61lX5OpC46iql6hpsrlOBD3BroYfcwgk1t3YdcNOhVWrmkrlVptGQ/oy6T/LSIKbkG/tJsuV8sl6w1Z31IesK6MZDfSJbcXw=="
    );
  });
});

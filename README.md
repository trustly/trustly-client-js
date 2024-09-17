
[![NPM Version](https://img.shields.io/npm/v/%40trustly-group%2Fclient)]()
[![NPM License](https://img.shields.io/github/license/trustly/trustly-client-js)](https://github.com/trustly/trustly-client-js/blob/master/LICENSE.md)

Trustly NodeJS Client
===================

This is an example implementation of the communication with the Trustly API using JavaScript/Node. It implements the standard Payments API which includes deposits, withdrawals and refunds.

For full documentation on the Trustly API internals visit our developer website: https://eu.developers.trustly.com. All information about software flows and call patterns can be found on that site. The documentation within this code will only cover the code itself, not how you use the Trustly API.

This code is provided as-is, use it as inspiration, reference or drop it directly into your own project and use it.

If you find a problem in the code or want to extend it, feel free to fork it and send us a pull request.

## Create Client

You can easily create an instance of the client, giving a settings object with different levels of granular options.

```TypeScript
import { TrustlyApiClient, TrustlyApiClientSettings } from '@trustly-group/client';
const client = new TrustlyApiClient(TrustlyApiClientSettings.forDefaultTest());
```

This is a shorthand to two different, more elaborate setups.

If there is an environment variable sent along to the application startup, it will load the username, password and certificates from the default environment variable names:

* `CLIENT_USERNAME`
* `CLIENT_PASSWORD`
* `CLIENT_CERT_PUBLIC`
* `CLIENT_CERT_PRIVATE`

These can of course be modified to something else, they are just the default names.
The `CLIENT_CERT_PUBLIC` and `CLIENT_CERT_PRIVATE` are not the paths to the certificate, but the certificates themselves in UTF-8 charset.

If an environment variable was found, it is virtually the same as creating a client using this setup:

1.
```TypeScript
const client = new TrustlyApiClient(TrustlyApiClientSettings
                    .forTest()
                    .withCredentialsFromEnv("CLIENT_USERNAME", "CLIENT_PASSWORD")
                    .withCertificatesFromEnv("CLIENT_CERT_PUBLIC", "CLIENT_CERT_PRIVATE")
                    .andTrustlyCertificate());
```

Or if there is no environment variable set, it will look for files in the client's user home directory.

The default file names are:

* `trustly_client_username.txt`
* `trustly_client_password.txt`
* `trustly_client_public.pem`
* `trustly_client_private.pem`

2.
```TypeScript
const client = new TrustlyApiClient(TrustlyApiClientSettings
                .forTest()
                .withCredentialsFromUserHome("trustly_client_username.txt", "trustly_client_password.txt")
                .withCertificatesFromUserHome("trustly_client_public.pem", "trustly_client_private.pem")
                .andTrustlyCertificate());
```

Which can of course also be overridden and customized.

## Make a request

A Request is done as simply as:

```TypeScript
const response = await client.deposit({
  NotificationURL: "https://fake.test.notification.trustly.com",
  EndUserID: "name@company.com",
  MessageID: "A Unique ID for you",
  Attributes: {
    Currency: "EUR",
    Amount: "100.00",
    Firstname: "John",
    Lastname: "Doe",
    Email: "name@company.com",
    MobilePhone: "070-123 45 67",
    Country: "SE",
    Locale: "sv_SE",
    ShopperStatement: "Trustly Test Deposit",
    SuccessURL: "https://google.com/?q=Success!",
    FailURL: "https://google.com/?q=Fail!",
  }
});
const redirectOrIFrameUrl = response.url;
```

Where the request and response types are typesafe and easy to handle. If there ever are properties which are not represented in the model, they will be placed under the `any` dictionary properties on the respective object graph levels.

## Handle notifications

There are two ways to insert the notifications into the client.
All these will end up calling on events available on the client, these are:

* `Account`
* `Cancel`
* `Credit`
* `Debit`
* `PayoutConfirmation`
* `Pending`
* `Unknown` (All properties will be placed in `any` dictionary property)

You register to these with event listeners:

```TypeScript
client.addNotificationListener('debit', async (args) => {
    console.log(`${args.data.amount} was debited`);
    await args.respondWithOk();
});
```

---

1. Giving your request and response handler to `TrustlyApiClientExtensions.handleNotificationRequest`.

Because of the many options of http servers in JavaScript-land, there is no default response handler supplied.

The example below uses `express` and gives the response handler as the third argument to `handleNotificationRequest`,

```TypeScript
import { TrustlyApiClient, TrustlyApiClientSettings, TrustlyApiClientExtensions } from '@trustly-group/client';
import express from "express";

const client = new TrustlyApiClient(TrustlyApiClientSettings.forDefaultProduction());
client.addNotificationListener('debit', async (args) => {
  // ... do something with the notification
  await args.respondWith('OK');
});

const app = express();

app.post("/trustly/notifications", async (req, res) => {
  await TrustlyApiClientExtensions.handleNotificationRequest(client, req.body, {
    addHeader: (key, value) => {
      res.appendHeader(key, value);
    },
    setStatus: (httpStatus) => {
      res.status(httpStatus);
    },
    writeBody: async (value) => {
      res.set('Content-Type', 'application/json');
      res.send(value);
    }
  });
});

app.listen(3000, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
```

This will register an POST mapping that listens to HTTP POSTs on context path `/trustly/notifications`.

It will use the given client to announce to event listeners, until one of them has reported the notification as done by calling `respondWithOk()` or `respondWithFailed()` on the event args.
If no event listener on a client responds with `OK` nor `Failed` an exception will be thrown. If an unexpected exception is thrown, we will respond with a `Fail` with the exception message attached.

---

2. Or Manually, by calling on `client.handleNotification(jsonBody: string, onResponse?: NotificationResponseHandler)`.

```TypeScript
export type NotificationResponseHandler = (method: string, uuid: string, status: 'OK' | 'FAILED' | 'CONTINUE', message?: string) => Promise<void>;
```

This will *not* automatically send an `OK` or `Failed` response back to the Trustly server.

Instead you need to implement the `onResponse` callback, if you want to use the event args' callback methods.

If you will not use the event args' callback methods, then you do not need to supply these callback arguments, and can respond with a JsonRpc response manually.

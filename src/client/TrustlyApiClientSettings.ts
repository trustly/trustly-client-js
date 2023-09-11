import {TrustlyStringUtils} from '../util/TrustlyStringUtils';
import {TrustlyFileUtils} from '../util/TrustlyFileUtils';
import * as crypto from 'crypto';
import * as process from 'process';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import cert_trustly_test from '../../resources/keys/trustly_test_public.pem';
import cert_trustly_prod from '../../resources/keys/trustly_live_public.pem';

export interface TrustlyApiClientSettingsData {

  url: string;

  username: string;

  password: string;

  clientPublicKey: crypto.KeyObject;

  clientPrivateKey: crypto.KeyObject; // | crypto.SignKeyObjectInput | crypto.SignPrivateKeyInput;

  trustlyPublicKey: crypto.KeyObject;

  includeMessageInNotificationResponse: boolean;

  includeExceptionMessageInNotificationResponse: boolean;
}

export class TrustlyApiClientSettings {

  static readonly URL_TEST = 'https://test.trustly.com/api/1';
  static readonly URL_PRODUCTION = 'https://api.trustly.com/1';

  // private readonly settings: T;

  // constructor(settings: T) {
  //   this.settings = settings;
  //
  //   // TODO: Move this into the build method, where we fallback if nothing else if set.
  //   // if (this._settings.includeMessageInNotificationResponse === undefined) {
  //   //   this._settings.includeMessageInNotificationResponse = true;
  //   // }
  //   //
  //   // if (this._settings.includeExceptionMessageInNotificationResponse === undefined) {
  //   //   this._settings.includeExceptionMessageInNotificationResponse = false;
  //   // }
  // }

  /**
   * Creates settings instance for production, by default looking among environment variables or falling back on files in user home.
   *
   * @return The complete settings instance to use with {@link TrustlyApiClient}.
   */
  public static forDefaultProduction(): TrustlyApiClientSettingsData {
    return TrustlyApiClientSettings.forDefaultCustom(TrustlyApiClientSettings.URL_PRODUCTION);
  }

  /**
   * Creates settings instance for test, by default looking among environment variables or falling back on files in user home.
   *
   * @return The complete settings instance to use with {@link TrustlyApiClient}.
   */
  public static forDefaultTest(): TrustlyApiClientSettingsData {
    return TrustlyApiClientSettings.forDefaultCustom(TrustlyApiClientSettings.URL_TEST);
  }

  /**
   * Quickly create a settings instance with a custom target URL.
   *
   * @param url            Custom URL for the client to send its requests to
   * @param username       Username of the merchant
   * @param password       Password for the merchant user
   * @param publicKeyPath  Path to public key. If null, it will be looked for in user home
   * @param privateKeyPath Path to private key. If null, it will be looked for in user home
   * @param envUsername    Name of username env variable
   * @param envPassword    Name of password env variable
   * @param envCertPublic  Name of public key env variable
   * @param envCertPrivate Name of private key env variable
   * @return The complete settings instance to use with {@link TrustlyApiClient}.
   */
  public static forDefaultCustom(
    url: string,
    username?: string | undefined | null,
    password?: string | undefined | null,
    publicKeyPath?: string | undefined,
    privateKeyPath?: string | undefined,
    envUsername = 'CLIENT_USERNAME',
    envPassword = 'CLIENT_PASSWORD',
    envCertPublic = 'CLIENT_CERT_PUBLIC',
    envCertPrivate = 'CLIENT_CERT_PRIVATE',
  ): TrustlyApiClientSettingsData {

    // envUsername = (envUsername === undefined) ? ' : envUsername;
    // envPassword = (envPassword === undefined) ?  : envPassword;
    // envCertPublic = (envCertPublic === undefined) ?  : envCertPublic;
    // envCertPrivate = (envCertPrivate === undefined) ?  : envCertPrivate;

    const settings: TrustlyApiClientSettingsWithEnvironment = new TrustlyApiClientSettingsWithEnvironment({url: url});

    const hasEnvUsername = !TrustlyStringUtils.isBlank(process.env[envUsername]);

    if (hasEnvUsername) {
      return TrustlyApiClientSettings.forTest()
        .withCredentialsFromEnv(envUsername, envPassword)
        .withCertificatesFromEnv(envCertPublic, envCertPrivate)
        .andTrustlyCertificate();
    } else {
      let withCredentials: TrustlyApiClientSettingsWithCredentials;
      if (username == undefined || password == undefined || TrustlyStringUtils.isBlank(username)) {
        withCredentials = settings.withCredentialsFromUserHome(undefined, undefined);
      } else {
        withCredentials = settings.withCredentials(username, password);
      }

      let withCertificates: TrustlyApiClientSettingsWithClientCertificates;
      if (!publicKeyPath || !privateKeyPath || TrustlyStringUtils.isBlank(privateKeyPath)) {
        withCertificates = withCredentials.withCertificatesFromUserHome();
      } else {
        withCertificates = withCredentials.withCertificatesFromFiles(publicKeyPath, privateKeyPath);
      }

      return withCertificates.andTrustlyCertificate();
    }
  }

  public static forProduction(): TrustlyApiClientSettingsWithEnvironment {
    return new TrustlyApiClientSettingsWithEnvironment({url: TrustlyApiClientSettings.URL_PRODUCTION});

    // return new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), TrustlyApiClientSettings.URL_PRODUCTION);
  }

  public static forTest(): TrustlyApiClientSettingsWithEnvironment {
    return new TrustlyApiClientSettingsWithEnvironment({url: TrustlyApiClientSettings.URL_TEST});

    //return new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), TrustlyApiClientSettings.URL_TEST);
  }

  public static forCustom(url: string): TrustlyApiClientSettingsWithEnvironment {
    if (TrustlyStringUtils.isBlank(url)) {
      throw new Error('The URL must not be null nor empty');
    }

    return new TrustlyApiClientSettingsWithEnvironment({url: url});

    // return new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), url);
  }

  public static getUserHome(): string {
    return os.homedir();
  }

  static streamToJavaPublicKey(content: crypto.KeyLike | crypto.PublicKeyInput | undefined, filename?: string): crypto.KeyObject {

    if (!content && filename) {
      content = fs.readFileSync(filename);
    }

    if (!content) {
      throw new Error(`Need to give a filename or file content`);
    }

    return crypto.createPublicKey(content);
  }

  static streamToJavaPrivateKey(content: string | crypto.PrivateKeyInput | Buffer | undefined, filename?: string): crypto.KeyObject {

    if (!content && filename) {
      content = fs.readFileSync(filename);
    }

    if (!content) {
      throw new Error(`Need to give a filename or file content`);
    }

    return crypto.createPrivateKey(content);
  }
}

export class TrustlyApiClientSettingsWithEnvironment {

  private readonly settings: Partial<TrustlyApiClientSettingsData>;

  public constructor(settings: Partial<TrustlyApiClientSettingsData>) {
    this.settings = settings;
  }

  /**
   * For internal use, do not use. You must supply credentials to be able to make requests.
   */
  withoutCredentials(): TrustlyApiClientSettingsWithCredentials {
    return new TrustlyApiClientSettingsWithCredentials({
      ...this.settings
    });
  }

  withCredentials(username: string, password: string): TrustlyApiClientSettingsWithCredentials {
    return new TrustlyApiClientSettingsWithCredentials({
      ...this.settings,
      username: username,
      password: password,
    });
  }

  withCredentialsFromEnv(envUsername = 'CLIENT_USERNAME', envPassword = 'CLIENT_PASSWORD'): TrustlyApiClientSettingsWithCredentials {

    let username: string | undefined | null = process.env[envUsername];
    let password: string | undefined | null =  process.env[envPassword];

    if (username == '') {
      username = null;
    }

    if (password == '') {
      password = null;
    }

    if (username == undefined) {
      throw new Error(`Could not find env ${envUsername}`);
    }

    if (password == undefined) {
      throw new Error(`Could not find env ${envPassword}`);
    }

    return new TrustlyApiClientSettingsWithCredentials(
      {
        ...this.settings,
        username: username,
        password: password,
      },
    );
  }

  withCredentialsFromUserHome(
    clientUsernameFileName = 'trustly_client_username.txt',
    clientPasswordFileName = 'trustly_client_password.txt',
  ): TrustlyApiClientSettingsWithCredentials {

    return this.withCredentialsFromDirectory(
      TrustlyApiClientSettings.getUserHome(),
      clientUsernameFileName,
      clientPasswordFileName
    );
  }

  withCredentialsFromDirectory(
    directoryPath = TrustlyApiClientSettings.getUserHome(),
    clientUsernameFileName = 'trustly_client_username.txt',
    clientPasswordFileName = 'trustly_client_password.txt',
  ): TrustlyApiClientSettingsWithCredentials {

    return this.withCredentialsFromFiles(
      path.join(directoryPath, clientUsernameFileName),
      path.join(directoryPath, clientPasswordFileName),
    );
  }

  withCredentialsFromFiles(usernamePath: string, passwordPath: string): TrustlyApiClientSettingsWithCredentials {

    if (!fs.existsSync(usernamePath)) {
      throw new Error(`Cannot create api settings since username key file ${usernamePath} is missing`);
    }
    if (!fs.existsSync(passwordPath)) {
      throw new Error(`Cannot create api settings since password key file ${passwordPath} is missing`);
    }

    return new TrustlyApiClientSettingsWithCredentials(
      {
        ...this.settings,
        username: TrustlyFileUtils.readAllText(usernamePath).trim(),
        password: TrustlyFileUtils.readAllText(passwordPath).trim(),
      },
    );
  }
}

export class TrustlyApiClientSettingsWithCredentials {

  private readonly settings: Partial<TrustlyApiClientSettingsData>;

  public constructor(settings: Partial<TrustlyApiClientSettingsData>) {
    this.settings = settings;
  }

  withCertificatesFromEnv(envCertPublic = 'CLIENT_CERT_PUBLIC', envCertPrivate = 'CLIENT_CERT_PRIVATE'): TrustlyApiClientSettingsWithClientCertificates {

    const certPublic = process.env[envCertPublic];
    const certPrivate = process.env[envCertPrivate];

    if (!certPublic) {
      throw new Error(`No public certificate found at env ${envCertPublic}`);
    }

    if (!certPrivate) {
      throw new Error(`No private certificate found at env ${envCertPrivate}`);
    }

    return this.withCertificatesFromFiles(certPublic, certPrivate);
  }

  withCertificatesFromUserHome(
    clientPublicKeyFileName = 'trustly_client_public.pem',
    clientPrivateKeyFileName = 'trustly_client_private.pem',
  ): TrustlyApiClientSettingsWithClientCertificates {

    const directory: string = TrustlyApiClientSettings.getUserHome();
    return this.withCertificatesFromDirectory(directory, clientPublicKeyFileName, clientPrivateKeyFileName);
  }


  withCertificatesFromDirectory(
    directoryPath: string,
    clientPublicKeyFileName = 'trustly_client_public.pem',
    clientPrivateKeyFileName = 'trustly_client_private.pem',
  ): TrustlyApiClientSettingsWithClientCertificates {

    return this.withCertificatesFromFiles(
      path.join(directoryPath, clientPublicKeyFileName),
      path.join(directoryPath, clientPrivateKeyFileName),
    );
  }

  withCertificatesFromFiles(
    publicFile: string,
    privateFile: string,
  ): TrustlyApiClientSettingsWithClientCertificates {

    // TODO: Replace by reading files into a string and then giving it to withCertificatesFromContent
    const javaPublicKey = TrustlyApiClientSettings.streamToJavaPublicKey(undefined, publicFile);
    const javaPrivateKey = TrustlyApiClientSettings.streamToJavaPrivateKey(undefined, privateFile);

    return new TrustlyApiClientSettingsWithClientCertificates({
      ...this.settings,
      clientPublicKey: javaPublicKey,
      clientPrivateKey: javaPrivateKey,
    });
  }

  withCertificatesFromContent(
    publicFile: string,
    privateFile: string,
  ): TrustlyApiClientSettingsWithClientCertificates {

    // TODO: Replace by reading files into a string and then giving it to withCertificatesFromContent
    const javaPublicKey = TrustlyApiClientSettings.streamToJavaPublicKey(publicFile);
    const javaPrivateKey = TrustlyApiClientSettings.streamToJavaPrivateKey(privateFile);

    return new TrustlyApiClientSettingsWithClientCertificates({
      ...this.settings,
      clientPublicKey: javaPublicKey,
      clientPrivateKey: javaPrivateKey,
    });
  }
}

export class TrustlyApiClientSettingsWithClientCertificates {

  private readonly settings: Partial<TrustlyApiClientSettingsData>;

  public constructor(settings: Partial<TrustlyApiClientSettingsData>) {
    this.settings = settings;
  }

  andTrustlyCertificate(): TrustlyApiClientSettingsData {
    if (TrustlyApiClientSettings.URL_PRODUCTION == this.settings.url) {
      return this.andTrustlyCertificateProduction();
    } else if (TrustlyApiClientSettings.URL_TEST == this.settings.url) {
      return this.andTrustlyCertificateTest();
    } else {
      throw new Error(
        'You can only automatically choose the Trustly certificate if you used the ForProduction() or ForTest() builder steps');
    }
  }

  andTrustlyCertificateProduction(): TrustlyApiClientSettingsData {
    return this.andTrustlyCertificateFromContent(cert_trustly_prod);
  }

  andTrustlyCertificateTest(): TrustlyApiClientSettingsData {
    return this.andTrustlyCertificateFromContent(cert_trustly_test);
  }

  andTrustlyCertificateFromUserHome(trustlyPublicKeyFileName = 'trustly_public.pem'): TrustlyApiClientSettingsData {

    return this.andTrustlyCertificateFromDirectory(
      TrustlyApiClientSettings.getUserHome(),
      trustlyPublicKeyFileName
    );
  }

  andTrustlyCertificateFromDirectory(directoryPath: string, trustlyPublicKeyFileName = 'trustly_public.pem'): TrustlyApiClientSettingsData {

    return this.andTrustlyCertificateFromFile(
      path.join(directoryPath, trustlyPublicKeyFileName),
    );
  }

  andTrustlyCertificateFromFile(filePath: string): TrustlyApiClientSettingsData {

    this.settings.trustlyPublicKey = TrustlyApiClientSettings.streamToJavaPublicKey(undefined, filePath);
    if (this.settings.trustlyPublicKey === null) {
      throw new Error('Failed to load Trustly public key from stream');
    }

    if (TrustlyStringUtils.isBlank(this.settings.username)) {
      throw new Error('The username must be set');
    }

    if (TrustlyStringUtils.isBlank(this.settings.password)) {
      throw new Error('The password must be set');
    }

    return this.ensureComplete(this.settings);
  }

  andTrustlyCertificateFromContent(content: string): TrustlyApiClientSettingsData {

    this.settings.trustlyPublicKey = TrustlyApiClientSettings.streamToJavaPublicKey(content);
    return this.ensureComplete(this.settings);
  }

  private ensureComplete(settings: Partial<TrustlyApiClientSettingsData>): TrustlyApiClientSettingsData {

    if (!settings.clientPublicKey) {
      throw new Error(`No client public key set`);
    }

    if (!settings.clientPrivateKey) {
      throw new Error(`No client private key set`);
    }

    if (!settings.trustlyPublicKey) {
      throw new Error(`No trustly public key set`);
    }

    return {
      url: settings.url ?? '',
      username: settings.username ?? '',
      password: settings.password ?? '',
      clientPublicKey: settings.clientPublicKey,
      clientPrivateKey: settings.clientPrivateKey,
      trustlyPublicKey: settings.trustlyPublicKey,
      includeMessageInNotificationResponse: settings.includeMessageInNotificationResponse ?? true,
      includeExceptionMessageInNotificationResponse: settings.includeExceptionMessageInNotificationResponse ?? false
    };
  }
}

import {closeResources, handleResourceError, int, java, S, throwResourceError} from 'jree';
import {TrustlyStringUtils} from '../util/TrustlyStringUtils';

export class TrustlyApiClientSettings {

  protected static readonly URL_TEST = 'https://test.trustly.com/api/1';
  protected static readonly URL_PRODUCTION = 'https://api.trustly.com/1';

  private url?: string;

  private username?: string;

  private password?: string;

  private clientPublicKey: java.security.PublicKey | null;

  private clientPrivateKey: java.security.PrivateKey | null;

  private trustlyPublicKey: java.security.PublicKey | null;

  private includeMessageInNotificationResponse = true;

  private includeExceptionMessageInNotificationResponse = false;

  public getUrl(): string | undefined {
    return this.url;
  }

  public getUsername(): string | undefined {
    return this.username;
  }

  public getPassword(): string | undefined {
    return this.password;
  }

  public getClientPublicKey(): java.security.PublicKey | null {
    return this.clientPublicKey;
  }

  public getClientPrivateKey(): java.security.PrivateKey | null {
    return this.clientPrivateKey;
  }

  public getTrustlyPublicKey(): java.security.PublicKey | null {
    return this.trustlyPublicKey;
  }

  public isIncludeMessageInNotificationResponse(): boolean {
    return this.includeMessageInNotificationResponse;
  }

  public setIncludeMessageInNotificationResponse(includeMessageInNotificationResponse: boolean): void {
    this.includeMessageInNotificationResponse = includeMessageInNotificationResponse;
  }

  public isIncludeExceptionMessageInNotificationResponse(): boolean {
    return this.includeExceptionMessageInNotificationResponse;
  }

  public setIncludeExceptionMessageInNotificationResponse(includeExceptionMessageInNotificationResponse: boolean): void {
    this.includeExceptionMessageInNotificationResponse = includeExceptionMessageInNotificationResponse;
  }

  /**
   * Creates settings instance for production, by default looking among environment variables or falling back on files in user home.
   *
   * @return The complete settings instance to use with {@link TrustlyApiClient}.
   */
  public static forDefaultProduction(): TrustlyApiClientSettings {
    return TrustlyApiClientSettings.forDefaultCustom(
      TrustlyApiClientSettings.URL_PRODUCTION,
      null, null, null, null,
      null, null, null, null,
    );
  }

  /**
   * Creates settings instance for test, by default looking among environment variables or falling back on files in user home.
   *
   * @return The complete settings instance to use with {@link TrustlyApiClient}.
   */
  public static forDefaultTest(): TrustlyApiClientSettings {
    return TrustlyApiClientSettings.forDefaultCustom(
      TrustlyApiClientSettings.URL_TEST,
      null, null, null, null,
      null, null, null, null,
    );
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
    url: string | null,
    username: string | null,
    password: string | null,
    publicKeyPath: string | null,
    privateKeyPath: string | null,
    envUsername: string | null,
    envPassword: string | null,
    envCertPublic: string | null,
    envCertPrivate: string | null,
  ): TrustlyApiClientSettings {

    envUsername = (envUsername === null) ? 'CLIENT_USERNAME' : envUsername;
    envPassword = (envPassword === null) ? 'CLIENT_PASSWORD' : envPassword;
    envCertPublic = (envCertPublic === null) ? 'CLIENT_CERT_PUBLIC' : envCertPublic;
    envCertPrivate = (envCertPrivate === null) ? 'CLIENT_CERT_PRIVATE' : envCertPrivate;

    const settings: TrustlyApiClientSettings.WithEnvironment = new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), url);

    const hasEnvUsername = !TrustlyStringUtils.isBlank(java.lang.System.getenv(envUsername));

    if (hasEnvUsername) {
      return TrustlyApiClientSettings.forTest()
        .withCredentialsFromEnv(envUsername, envPassword)
        .withCertificatesFromEnv(envCertPublic, envCertPrivate)
        .andTrustlyCertificate();
    } else {
      let withCredentials: TrustlyApiClientSettings.WithCredentials;
      if (TrustlyStringUtils.isBlank(username)) {
        withCredentials = settings
          .withCredentialsFromUserHome(null, null);
      } else {
        withCredentials = settings
          .withCredentials(username, password);
      }

      let withCertificates: TrustlyApiClientSettings.WithClientCertificates;
      if (TrustlyStringUtils.isBlank(privateKeyPath)) {
        withCertificates = withCredentials
          .withCertificatesFromUserHome(null, null);
      } else {
        withCertificates = withCredentials
          .withCertificatesFromFiles(publicKeyPath, privateKeyPath);
      }

      return withCertificates.andTrustlyCertificate();
    }
  }

  public static forProduction(): TrustlyApiClientSettings.WithEnvironment {
    return new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), TrustlyApiClientSettings.URL_PRODUCTION);
  }

  public static forTest(): TrustlyApiClientSettings.WithEnvironment {
    return new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), TrustlyApiClientSettings.URL_TEST);
  }

  public static forCustom(url: string | null): TrustlyApiClientSettings.WithEnvironment {
    if (TrustlyStringUtils.isBlank(url)) {
      throw new java.lang.IllegalArgumentException('The URL must not be null nor empty');
    }

    return new TrustlyApiClientSettings.WithEnvironment(new TrustlyApiClientSettings(), url);
  }

  public static WithEnvironment = class WithEnvironment {

    private readonly settings: TrustlyApiClientSettings | null;

    public constructor(settings: TrustlyApiClientSettings | null, url: string | null) {
      super();
      this.settings = settings;
      this.settings.url = url;
    }

    /**
     * For internal use, do not use. You must supply credentials to be able to make requests.
     */
    public withoutCredentials(): TrustlyApiClientSettings.WithCredentials | null {
      return new TrustlyApiClientSettings.WithCredentials(this.settings, null, null);
    }

    public withCredentials(username: string | null, password: string | null): TrustlyApiClientSettings.WithCredentials {
      return new TrustlyApiClientSettings.WithCredentials(this.settings, username, password);
    }

    public withCredentialsFromEnv(envUsername: string | null, envPassword: string | null): TrustlyApiClientSettings.WithCredentials {

      envUsername = (envUsername === null) ? 'CLIENT_USERNAME' : envUsername;
      envPassword = (envPassword === null) ? 'CLIENT_PASSWORD' : envPassword;

      return new TrustlyApiClientSettings.WithCredentials(
        this.settings,
        java.lang.System.getenv(envUsername),
        java.lang.System.getenv(envPassword),
      );
    }

    public withCredentialsFromUserHome(): TrustlyApiClientSettings.WithCredentials | null;

    public withCredentialsFromUserHome(
      clientUsernameFileName: string,
      clientPasswordFileName: string,
    ): TrustlyApiClientSettings.WithCredentials;
    public withCredentialsFromUserHome(...args: unknown[]): TrustlyApiClientSettings.WithCredentials | null {
      switch (args.length) {
        case 0: {

          return this.withCredentialsFromUserHome(null, null);


          break;
        }

        case 2: {
          const [clientUsernameFileName, clientPasswordFileName] = args as [string, string];


          const directory: string = TrustlyApiClientSettings.getUserHome();

          try {
            return this.withCredentialsFromDirectory(directory, clientUsernameFileName, clientPasswordFileName);
          } catch (ex) {
            if (ex instanceof java.io.IOException) {
              throw new java.lang.IllegalArgumentException('Could not load credentials from user home', ex);
            } else {
              throw ex;
            }
          }


          break;
        }

        default: {
          throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
      }
    }


    public withCredentialsFromDirectory(
      directoryPath: string | null,
      clientUsernameFileName: string | null,
      clientPasswordFileName: string | null,
    ): TrustlyApiClientSettings.WithCredentials | null {

      clientUsernameFileName = (clientUsernameFileName === null) ? 'trustly_client_username.txt' : null;
      clientPasswordFileName = (clientPasswordFileName === null) ? 'trustly_client_password.txt' : null;

      const usernamePath: string = java.nio.file.Paths.get(directoryPath, clientUsernameFileName).toString();
      const passwordPath: string = java.nio.file.Paths.get(directoryPath, clientPasswordFileName).toString();

      return this.withCredentialsFromFiles(usernamePath, passwordPath);
    }

    public withCredentialsFromFiles(usernamePath: string | null, passwordPath: string | null): TrustlyApiClientSettings.WithCredentials | null {
      if (!new java.io.File(usernamePath).exists()) {
        throw new java.lang.IllegalArgumentException(string.format('Cannot create api settings since username key file %s is missing', usernamePath));
      }
      if (!new java.io.File(passwordPath).exists()) {
        throw new java.lang.IllegalArgumentException(string.format('Cannot create api settings since password key file %s is missing', passwordPath));
      }

      return new TrustlyApiClientSettings.WithCredentials(
        this.settings,
        TrustlyFileUtils.readAllText(usernamePath).trim(),
        TrustlyFileUtils.readAllText(passwordPath).trim(),
      );
    }
  };


  public static WithCredentials = class WithCredentials {

    private readonly settings: TrustlyApiClientSettings;

    public constructor(settings: TrustlyApiClientSettings, username: string, password: string) {
      super();
      this.settings = settings;
      this.settings.username = username;
      this.settings.password = password;
    }

    public withCertificatesFromEnv(envCertPublic: string | null, envCertPrivate: string | null): TrustlyApiClientSettings.WithClientCertificates {

      envCertPublic = (!envCertPublic) ? 'CLIENT_CERT_PUBLIC' : envCertPublic;
      envCertPrivate = (!envCertPrivate) ? 'CLIENT_CERT_PRIVATE' : envCertPrivate;

      const certPublic: string = java.lang.System.getenv(envCertPublic);
      const certPrivate: string = java.lang.System.getenv(envCertPrivate);

      try {
// This holds the final error to throw (if any).
        let error: java.lang.Throwable | undefined;

        const streamPublic: java.io.InputStream = new java.io.ByteArrayInputStream(java.nio.charset.StandardCharsets.UTF_8.encode(certPublic).array());
        try {
          try {
            {
// This holds the final error to throw (if any).
              let error: java.lang.Throwable | undefined;

              const streamPrivate: java.io.InputStream = new java.io.ByteArrayInputStream(java.nio.charset.StandardCharsets.UTF_8.encode(certPrivate).array());
              try {
                try {
                  return this.withCertificatesFromStreams(streamPublic, streamPrivate);
                } finally {
                  error = closeResources([streamPrivate]);
                }
              } catch (e) {
                error = handleResourceError(e, error);
              } finally {
                throwResourceError(error);
              }
            }

          } finally {
            error = closeResources([streamPublic]);
          }
        } catch (e) {
          error = handleResourceError(e, error);
        } finally {
          throwResourceError(error);
        }
      } catch (ex) {
        if (ex instanceof java.io.IOException) {
          throw new java.lang.IllegalArgumentException(
            string.format('Could not read certificates given through env \'%s\' and \'%s\'', envCertPublic, envCertPrivate),
          );
        } else {
          throw ex;
        }
      }
    }

    public withCertificatesFromUserHome(): TrustlyApiClientSettings.WithClientCertificates | null;

    public withCertificatesFromUserHome(
      clientPublicKeyFileName: string | null,
      clientPrivateKeyFileName: string | null,
    ): TrustlyApiClientSettings.WithClientCertificates | null;
    public withCertificatesFromUserHome(...args: unknown[]): TrustlyApiClientSettings.WithClientCertificates | null {
      switch (args.length) {
        case 0: {

          return this.withCertificatesFromUserHome(null, null);


          break;
        }

        case 2: {
          const [clientPublicKeyFileName, clientPrivateKeyFileName] = args as [string, string];


          clientPublicKeyFileName = (clientPublicKeyFileName === null) ? 'trustly_client_public.pem' : clientPublicKeyFileName;
          clientPrivateKeyFileName = (clientPrivateKeyFileName === null) ? 'trustly_client_private.pem' : clientPrivateKeyFileName;

          const directory: string = TrustlyApiClientSettings.getUserHome();
          return this.withCertificatesFromDirectory(directory, clientPublicKeyFileName, clientPrivateKeyFileName);


          break;
        }

        default: {
          throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
      }
    }


    public withCertificatesFromDirectory(
      directoryPath: string | null,
      clientPublicKeyFileName: string | null,
      clientPrivateKeyFileName: string | null,
    ): TrustlyApiClientSettings.WithClientCertificates | null {

      clientPublicKeyFileName = (clientPublicKeyFileName === null) ? 'trustly_client_public.pem' : clientPublicKeyFileName;
      clientPrivateKeyFileName = (clientPrivateKeyFileName === null) ? 'trustly_client_private.pem' : clientPrivateKeyFileName;

      return this.withCertificatesFromFiles(
        java.nio.file.Paths.get(directoryPath, clientPublicKeyFileName).toString(),
        java.nio.file.Paths.get(directoryPath, clientPrivateKeyFileName).toString(),
      );
    }

    public withCertificatesFromFiles(clientPublicKeyPath: string | null, clientPrivateKeyPath: string | null): TrustlyApiClientSettings.WithClientCertificates | null {
      try {
// This holds the final error to throw (if any).
        let error: java.lang.Throwable | undefined;

        const publicFileStream: java.io.FileInputStream = new java.io.FileInputStream(clientPublicKeyPath);
        try {
          try {
            {
// This holds the final error to throw (if any).
              let error: java.lang.Throwable | undefined;

              const privateFileStream: java.io.FileInputStream = new java.io.FileInputStream(clientPrivateKeyPath);
              try {
                try {
                  return this.withCertificatesFromStreams(publicFileStream, privateFileStream);
                } finally {
                  error = closeResources([privateFileStream]);
                }
              } catch (e) {
                error = handleResourceError(e, error);
              } finally {
                throwResourceError(error);
              }
            }

          } finally {
            error = closeResources([publicFileStream]);
          }
        } catch (e) {
          error = handleResourceError(e, error);
        } finally {
          throwResourceError(error);
        }
      } catch (ex) {
        if (ex instanceof java.io.IOException) {
          throw new java.lang.IllegalArgumentException('Could not read certificates from given paths', ex);
        } else {
          throw ex;
        }
      }
    }

    public withCertificatesFromStreams(
      publicFileStream: java.io.InputStream | null,
      privateFileStream: java.io.InputStream | null,
    ): TrustlyApiClientSettings.WithClientCertificates {

      try {
        const javaPublicKey: java.security.PublicKey = TrustlyApiClientSettings.streamToJavaPublicKey(publicFileStream, null);
        const javaPrivateKey: java.security.PrivateKey = TrustlyApiClientSettings.streamToJavaPrivateKey(privateFileStream, null);

        return new TrustlyApiClientSettings.WithClientCertificates(this.settings, javaPublicKey, javaPrivateKey);
      } catch (ex) {
        if (ex instanceof java.io.IOException) {
          throw new java.lang.IllegalArgumentException('Could not initialize with certificates from stream', ex);
        } else {
          throw ex;
        }
      }
    }
  };


  public static WithClientCertificates = class WithClientCertificates {

    private readonly settings: TrustlyApiClientSettings;

    public constructor(settings: TrustlyApiClientSettings, clientPublicKey: java.security.PublicKey, clientPrivateKey: java.security.PrivateKey) {
      this.settings = settings;

      this.settings.clientPublicKey = clientPublicKey;
      this.settings.clientPrivateKey = clientPrivateKey;
    }

    public andTrustlyCertificate(): TrustlyApiClientSettings {
      if (TrustlyApiClientSettings.URL_PRODUCTION.equals(this.settings.getUrl())) {
        return this.andTrustlyCertificateProduction();
      } else if (TrustlyApiClientSettings.URL_TEST.equals(this.settings.getUrl())) {
        return this.andTrustlyCertificateTest();
      } else {
        throw new java.lang.IllegalArgumentException(
          'You can only automatically choose the Trustly certificate if you used the ForProduction() or ForTest() builder steps');
      }
    }

    public andTrustlyCertificateProduction(): TrustlyApiClientSettings {

      return this.andTrustlyCertificateFromStream(
        this.getClass().getResourceAsStream('/keys/trustly_live_public.pem'),
      );
    }

    public andTrustlyCertificateTest(): TrustlyApiClientSettings {

      return this.andTrustlyCertificateFromStream(
        this.getClass().getResourceAsStream('/keys/trustly_test_public.pem'),
      );
    }

    public andTrustlyCertificateFromUserHome(trustlyPublicKeyFileName: string | null): TrustlyApiClientSettings {

      trustlyPublicKeyFileName = (trustlyPublicKeyFileName === null) ? 'trustly_public.pem' : trustlyPublicKeyFileName;

      const directory: string = TrustlyApiClientSettings.getUserHome();
      return this.andTrustlyCertificateFromDirectory(directory, trustlyPublicKeyFileName);
    }

    public andTrustlyCertificateFromDirectory(directoryPath: string | null, trustlyPublicKeyFileName: string | null): TrustlyApiClientSettings {

      trustlyPublicKeyFileName = (trustlyPublicKeyFileName === null) ? 'trustly_public.pem' : trustlyPublicKeyFileName;

      return this.andTrustlyCertificateFromFile(
        java.nio.file.Paths.get(directoryPath, trustlyPublicKeyFileName).toString(),
      );
    }

    public andTrustlyCertificateFromFile(filePath: string | null): TrustlyApiClientSettings {
      {
// This holds the final error to throw (if any).
        let error: java.lang.Throwable | undefined;

        const publicFileStream: java.io.FileInputStream = new java.io.FileInputStream(filePath);
        try {
          try {
            return this.andTrustlyCertificateFromStream(publicFileStream);
          } finally {
            error = closeResources([publicFileStream]);
          }
        } catch (e) {
          error = handleResourceError(e, error);
        } finally {
          throwResourceError(error);
        }
      }

    }

    public andTrustlyCertificateFromStream(stream: java.io.InputStream | null): TrustlyApiClientSettings {

      try {

        this.settings.trustlyPublicKey = TrustlyApiClientSettings.streamToJavaPublicKey(stream, null);
        if (this.settings.trustlyPublicKey === null) {
          throw new java.lang.IllegalArgumentException('Failed to load Trustly public key from stream');
        }

        if (TrustlyStringUtils.isBlank(this.settings.getUsername())) {
          throw new java.lang.IllegalArgumentException('The username must be set');
        }

        if (TrustlyStringUtils.isBlank(this.settings.getPassword())) {
          throw new java.lang.IllegalArgumentException('The password must be set');
        }

        return this.settings;
      } catch (ex) {
        if (ex instanceof java.io.IOException) {
          throw new java.lang.IllegalArgumentException('Could not load Trustly certificate from input stream', ex);
        } else {
          throw ex;
        }
      }
    }
  };


  private static getUserHome(): string | null {
    return java.lang.System.getProperty('user.home');
  }

  private static readerToPemObject(is: java.io.InputStream | null): PemObject {

    {
// This holds the final error to throw (if any).
      let error: java.lang.Throwable | undefined;

      const publicReader: java.io.InputStreamReader = new java.io.InputStreamReader(is);
      try {
        try {

          const publicPemParser: PemReader = new PemReader(publicReader);
          return publicPemParser.readPemObject();
        } finally {
          error = closeResources([publicReader]);
        }
      } catch (e) {
        error = handleResourceError(e, error);
      } finally {
        throwResourceError(error);
      }
    }

  }

  private static streamToJavaPublicKey(is: java.io.InputStream, filename: string): java.security.PublicKey {

    let content: Int8Array;
    if (filename !== null && filename.toLowerCase(java.util.Locale.ROOT).endsWith('.der')) {

      const bufferSize: int = 1024;
      const buffer: Int8Array = new Array<number>(bufferSize);
      const baos: java.io.ByteArrayOutputStream = new java.io.ByteArrayOutputStream();
      for (let numRead: int; (numRead = is.read(buffer, 0, buffer.length)) > 0;) {
        baos.write(buffer, 0, numRead);
      }

      content = baos.toByteArray();

    } else {
      const publicObject: PemObject = TrustlyApiClientSettings.readerToPemObject(is);
      content = publicObject.getContent();
    }

    const spec: java.security.spec.X509EncodedKeySpec = new java.security.spec.X509EncodedKeySpec(content);

    try {

      if (java.security.Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) === null) {
        java.security.Security.addProvider(new BouncyCastleProvider());
      }

      const factory: java.security.KeyFactory = java.security.KeyFactory.getInstance('RSA', BouncyCastleProvider.PROVIDER_NAME);
      return factory.generatePublic(spec);
    } catch (e) {
      if (e instanceof java.security.NoSuchAlgorithmException) {
        throw new java.io.IOException('Could not find the required algorithm', e);
      } else if (e instanceof java.security.spec.InvalidKeySpecException) {
        throw new java.io.IOException('Could not load the public key because of an invalid key spec', e);
      } else if (e instanceof java.security.NoSuchProviderException) {
        throw new java.io.IOException('Could not find the BouncyCastle key provider', e);
      } else {
        throw e;
      }
    }
  }

  private static streamToJavaPrivateKey(is: java.io.InputStream, filename: string): java.security.PrivateKey {

    let content: Int8Array;
    if (filename !== null && filename.toLowerCase(java.util.Locale.ROOT).endsWith('.der')) {

      const bufferSize: int = 1024;
      const buffer: Int8Array = new Array<number>(bufferSize);
      const baos: java.io.ByteArrayOutputStream = new java.io.ByteArrayOutputStream();
      for (let numRead: int; (numRead = is.read(buffer, 0, buffer.length)) > 0;) {
        baos.write(buffer, 0, numRead);
      }

      content = baos.toByteArray();

    } else {
      const publicObject: PemObject = TrustlyApiClientSettings.readerToPemObject(is);
      content = publicObject.getContent();
    }

    const spec: java.security.spec.PKCS8EncodedKeySpec = new java.security.spec.PKCS8EncodedKeySpec(content);

    try {

      if (java.security.Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) === null) {
        java.security.Security.addProvider(new BouncyCastleProvider());
      }

      const factory: java.security.KeyFactory = java.security.KeyFactory.getInstance('RSA', BouncyCastleProvider.PROVIDER_NAME);
      return factory.generatePrivate(spec);
    } catch (e) {
      if (e instanceof java.security.NoSuchAlgorithmException) {
        throw new java.io.IOException('Could not find the required algorithm', e);
      } else if (e instanceof java.security.spec.InvalidKeySpecException) {
        throw new java.io.IOException('Could not load the public key because of an invalid key spec', e);
      } else if (e instanceof java.security.NoSuchProviderException) {
        throw new java.io.IOException('Could not find the BouncyCastle key provider', e);
      } else {
        throw e;
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TrustlyApiClientSettings {
  export type WithEnvironment = InstanceType<typeof TrustlyApiClientSettings.WithEnvironment>;
  export type WithCredentials = InstanceType<typeof TrustlyApiClientSettings.WithCredentials>;
  export type WithClientCertificates = InstanceType<typeof TrustlyApiClientSettings.WithClientCertificates>;
}



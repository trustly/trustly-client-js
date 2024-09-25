import {HttpRequesterLoader} from '../request/HttpRequesterLoader';
import {HttpRequester} from '../request/HttpRequester';
import {TrustlyApiClientSettingsData} from './TrustlyApiClientSettings';
import {NodeJsHttpRequesterLoader} from '../request/NodeJsHttpRequesterLoader';
import {JsonRpcFactory} from './JsonRpcFactory';
import {JsonRpcSigner} from './JsonRpcSigner';
import {DefaultJsonRpcSigner} from './DefaultJsonRpcSigner';
import {Serializer} from './Serializer';
import {TrustlyValidationException} from '../domain/exceptions/TrustlyValidationException';
import {TrustlyErrorResponseException} from '../domain/exceptions/TrustlyErrorResponseException';
import {TrustlyRejectionException} from '../domain/exceptions/TrustlyRejectionException';
import {TrustlySignatureException} from '../domain/exceptions/TrustlySignatureException';
import {TrustlyRequestException} from '../domain/exceptions/TrustlyRequestException';
import {TrustlyStringUtils} from '../util/TrustlyStringUtils';
import {NotificationListener} from './NotificationListener';
import {NotificationArgs, NotificationResponseHandler} from './NotificationArgs';
import {TrustlyNoNotificationListenerException} from '../domain/exceptions/TrustlyNoNotificationListenerException';
import {
  AbstractRequestData,
  AbstractRequestDataAttributes,
  AccountLedgerRequestData,
  AccountLedgerResponseResult,
  AccountNotificationData,
  AccountPayoutRequestData,
  AccountPayoutResponseData,
  AckDataStatus,
  ApproveWithdrawalRequestData,
  ApproveWithdrawalResponseData,
  BalanceRequestData,
  BalanceResponseResult,
  CancelChargeRequestData,
  CancelChargeResponseData,
  CancelNotificationData,
  ChargeRequestData,
  ChargeResponseData,
  CreateAccountRequestData,
  CreateAccountResponseData,
  CreditNotificationData,
  DebitNotificationData,
  DebitNotificationResponseData,
  DenyWithdrawalRequestData,
  DenyWithdrawalResponseData,
  DepositRequestData,
  DepositResponseData,
  GetWithdrawalsRequestData,
  GetWithdrawalsResponseResult,
  JsonRpcErrorResponse,
  JsonRpcNotification,
  JsonRpcNotificationParams,
  JsonRpcRequest,
  JsonRpcRequestParams,
  JsonRpcResponse,
  KYCNotificationData,
  KYCNotificationResponseData,
  MerchantSettlementRequestData,
  MerchantSettlementResponseData,
  NotificationResponseDataBase,
  PayoutConfirmationNotificationData,
  PendingNotificationData,
  RefundRequestData,
  RefundResponseData,
  RegisterAccountPayoutRequestData,
  RegisterAccountPayoutResponseData,
  RegisterAccountRequestData,
  RegisterAccountResponseData,
  ResponseResult,
  SelectAccountRequestData,
  SelectAccountResponseData,
  SettlementReportRequestData,
  SettlementReportResponseData,
  SettlementReportResponseDataEntry,
  WithdrawRequestData,
  WithdrawResponseData,
  WithRejection
} from "../domain/models";
import {UnknownNotificationData} from "../domain/UnknownNotificationData";
import {SettlementReportParser} from "../domain/SettlementReportParser";
import {WithoutProvidedProperties} from "../domain/WithoutProvidedProperties";
import {FetchHttpRequesterLoader} from "../request/FetchHttpRequesterLoader";

type KnownNotificationTypes = {
  account: AccountNotificationData,
  cancel: CancelNotificationData,
  credit: CreditNotificationData,
  debit: DebitNotificationData,
  payoutconfirmation: PayoutConfirmationNotificationData,
  pending: PendingNotificationData,
  kyc: KYCNotificationData,
};

type KnownNotificationAckTypes = {
  debit: DebitNotificationResponseData,
  kyc: KYCNotificationResponseData,
};

export type NotificationTypes = KnownNotificationTypes & { [k: string]: UnknownNotificationData };
export type NotificationAckTypes = KnownNotificationAckTypes & { [k: string]: NotificationResponseDataBase<AckDataStatus> };

interface NotificationMeta<M extends string = string> {
  listeners: NotificationListener<M>[];
}

export class TrustlyApiClient {

  private static readonly AVAILABLE_HTTP_REQUESTERS: HttpRequesterLoader[] = [
    new FetchHttpRequesterLoader(),
    new NodeJsHttpRequesterLoader(),
  ];

  public static registerHttpRequester(requester: HttpRequester): void {
    TrustlyApiClient.AVAILABLE_HTTP_REQUESTERS.splice(0, 0, {
      create() {
        return requester;
      }
    });
  }

  private static getFirstAvailableHttpRequester(): HttpRequester {

    let foundHttpRequester: HttpRequester | undefined = undefined;
    for (const loader of TrustlyApiClient.AVAILABLE_HTTP_REQUESTERS) {

      foundHttpRequester = loader.create();
      if (foundHttpRequester) {
        break;
      }
    }

    if (!foundHttpRequester) {
      throw new Error('Could not find a suitable http requester factory');
    }

    return foundHttpRequester;
  }

  private readonly settings: TrustlyApiClientSettingsData;

  private readonly objectFactory: JsonRpcFactory = new JsonRpcFactory();
  private readonly signer: JsonRpcSigner;
  private readonly httpRequester: HttpRequester;

  private readonly onNotification = new Map<string, NotificationMeta>();

  public getSettings(): TrustlyApiClientSettingsData {
    return this.settings;
  }

  constructor(settings: TrustlyApiClientSettingsData, signer?: JsonRpcSigner, httpRequester?: HttpRequester) {

    if (!signer) {
      signer = new DefaultJsonRpcSigner(new Serializer(), settings);
    }

    if (!httpRequester) {
      httpRequester = TrustlyApiClient.getFirstAvailableHttpRequester();
    }

    this.settings = settings;
    this.signer = signer;
    this.httpRequester = httpRequester;
  }

  /**
   * Fetches the account ledger for the specified time period.
   * <p>
   * This report includes all the transactions (both incoming and outgoing transactions) that affect the merchant's Trustly account
   * balance.
   * <p>
   * Only settled transactions are included.
   */
  public accountLedger(request: WithoutProvidedProperties<AccountLedgerRequestData>): Promise<AccountLedgerResponseResult['data']> {
    return this.sendRequest<AccountLedgerResponseResult['data']>('AccountLedger', request);
  }

  /**
   * This method is used by merchants to transfer money to their customer's bank accounts.
   * <p>
   * The merchant specifies the receiving bank account in {@link AccountPayoutRequestData#AccountID}, which is a unique identifier
   * generated by Trustly.
   * <p>
   * The merchant can get the {@code AccountID} from {@link NotificationRequest}&lt;{@link AccountNotificationData}&gt; which is sent after
   * a {@link TrustlyApiClient#selectAccount} or {@link TrustlyApiClient#deposit} order has been completed.
   * <p>
   * Alternatively, the {@link TrustlyApiClient#registerAccount} method can be used to get the {@code AccountID}, if the merchant already
   * has the bank account details and want to register them in Trustly's system.
   * <p>
   * Funds must be transferred to the merchant's Trustly account before the payout can be made. No credit is given. To see how much money
   * you have on your Trustly account you can use the {@link TrustlyApiClient#balance} method or simply log in to the Trustly backoffice.
   * <p>
   * <h2>Example flow 1: SelectAccount + AccountPayout</h2>
   * <ol>
   *   <li>The merchant makes an API-call to {@link TrustlyApiClient#selectAccount} and redirects the end-user to {@link SelectAccountResponseData#url}.</li>
   *   <li>The end-user logs in to their bank and selects their bank account.</li>
   *   <li>Trustly sends an {@link NotificationRequest}&lt;{@link AccountNotificationData}&gt; to the merchant's system with an {@code AccountID} for the selected account.</li>
   *   <li>The merchant makes an API-call using this method with the {@link AccountPayoutRequestData#Amount} and {@link AccountPayoutRequestData#Currency} to transfer.</li>
   *   <li>Trustly's API replies with a synchronous response to let the merchant know that the AccountPayout request was received.</li>
   *   <li>
   *     A {@link NotificationRequest}&lt;{@link PayoutConfirmationNotificationData}&gt; is sent to the merchant when the transfer has been confirmed.
   * <p>
   *     Note: this notification is not enabled by default. Please speak to your Trustly contact person if you want to have it enabled.
   * <p>
   *     If the payout fails, a {@link NotificationRequest}&lt;{@link CreditNotificationData}&gt; is sent (see more details <a href="https://eu.developers.trustly.com/doc/docs/accountpayout#failed-payouts">here</a>).
   *   </li>
   * </ol>
   *
   * <h2>Example flow 2: RegisterAccount + AccountPayout</h2>
   * <ol>
   *   <li>The merchant makes an API-call to {@link TrustlyApiClient#registerAccount} method with the recipient's bank account details.</li>
   *   <li>Trustly's {@link TrustlyApiClient#registerAccount} API responds with {@link RegisterAccountResponseData#accountid} of the recipient's account.</li>
   *   <li>The merchant makes an API-call to this method with the {@link AccountPayoutRequestData#Amount} and {@link AccountPayoutRequestData#Currency} to transfer.</li>
   *   <li>Trustly's API replies with a synchronous response to let the merchant know that the AccountPayout request was received.</li>
   *   <li>
   *     A {@link NotificationRequest}&lt;{@link PayoutConfirmationNotificationData}&gt; is sent to the merchant when the transfer has been confirmed.
   * <p>
   *     Note: this notification is not enabled by default. Please speak to your Trustly contact person if you want to have it enabled.
   * <p>
   *     If the payout fails, a {@link NotificationRequest}&lt;{@link CreditNotificationData}&gt; is sent (see more details <a href="https://eu.developers.trustly.com/doc/docs/accountpayout#failed-payouts">here</a>).
   * <p>
   *     An {@code AccountID} does not expire in Trustly's system, so it can be used for multiple AccountPayout requests.
   *   </li>
   * </ol>
   */
  public accountPayout(request: WithoutProvidedProperties<AccountPayoutRequestData>): Promise<AccountPayoutResponseData> {
    return this.sendRequest<AccountPayoutResponseData>('AccountPayout', request);
  }

  /**
   * Approves a withdrawal prepared by the user. Please contact your integration manager at Trustly if you want to enable automatic approval
   * of the withdrawals.
   */
  public approveWithdrawal(request: WithoutProvidedProperties<ApproveWithdrawalRequestData>): Promise<ApproveWithdrawalResponseData> {
    return this.sendRequest<ApproveWithdrawalResponseData>('ApproveWithdrawal', request);
  }

  /**
   * This method returns the current balance for all currencies available on the merchant's Trustly account.
   * <p>
   * 🚧 Please do not use this method more than once every 15 minutes.
   */
  public balance(request: WithoutProvidedProperties<BalanceRequestData>): Promise<BalanceResponseResult['data']> {
    return this.sendRequest<BalanceResponseResult['data']>('Balance', request);
  }

  /**
   * For {@link TrustlyApiClient#charge} requests that have a future {@link ChargeRequestDataAttributes#PaymentDate}, it’s possible to
   * cancel the Charge up until 18:30 on the {@code PaymentDate}.
   * <p>
   * A {@code Charge} request that doesn’t have any {@code PaymentDate} specified cannot be canceled. It’s also not possible to cancel a
   * {@code Charge} request if the {@code PaymentDate} is equal to the date when {@code Charge} request was sent.
   */
  public cancelCharge(request: WithoutProvidedProperties<CancelChargeRequestData>): Promise<CancelChargeResponseData> {
    return this.sendRequest<CancelChargeResponseData>('CancelCharge', request);
  }

  /**
   * Charges a specific {@link ChargeRequestData#AccountID} using direct debit.
   * <p>
   * A previously approved direct debit mandate must exist on the {@link ChargeRequestData#AccountID} (see
   * {@link TrustlyApiClient#selectAccount} for details).
   */
  public charge(request: WithoutProvidedProperties<ChargeRequestData>): Promise<ChargeResponseData> {
    return this.sendRequest<ChargeResponseData>('Charge', request);
  }

  /**
   * Denies a withdrawal prepared by the user.
   * <p>
   * Please contact your integration manager at Trustly if you want to enable automatic approval of the withdrawals.
   */
  public denyWithdrawal(request: WithoutProvidedProperties<DenyWithdrawalRequestData>): Promise<DenyWithdrawalResponseData> {
    return this.sendRequest<DenyWithdrawalResponseData>('DenyWithdrawal', request);
  }

  /**
   * This method returns {@link DepositResponseData#url} where the end-user can make a payment from their bank account.
   * <p>
   * A typical Deposit flow is:
   * <ol>
   *   <li>The merchant sends a Deposit API call and receives a {@link DepositResponseData#url} back from Trustly's API.</li>
   *   <li>The merchant displays the {@link DepositResponseData#url} to the end-user (you can find more information about how to display the Trustly URL <a href="https://eu.developers.trustly.com/doc/docs/presentation-of-trustly-url">here</a>).</li>
   *   <li>The end-user selects their bank and completes the payment (in case the payment is not completed, a {@link NotificationRequest}&lt;{@link CancelNotificationData}&gt; is sent).</li>
   *   <li>
   *     Trustly sends a {@link NotificationRequest}&lt;{@link PendingNotificationData}&gt; to the {@link DepositRequestData#NotificationURL} when the end-user has completed the payment process,
   *     and a {@link NotificationRequest}&lt;{@link CreditNotificationData}&gt; is sent when the payment is confirmed.
   *     When the funds have settled, they will be credited to the merchant's Trustly account balance.
   *   </li>
   *   <li>
   *     (Optional) An {@link NotificationRequest}&lt;{@link AccountNotificationData}&gt; is sent to provide the merchant with more information about the account that was used to make the payment.
   * <p>
   *     This notification is not enabled by default, please reach out to your Trustly contact if you want to receive it.
   *   </li>
   *   <li>
   *     In case the Deposit fails, a {@link NotificationRequest}&lt;{@link DebitNotificationData}&gt; is sent
   *     (see more information <a href="https://eu.developers.trustly.com/doc/docs/deposit#failed-deposits">here</a>).
   *   </li>
   * </ol>
   */
  public deposit(request: WithoutProvidedProperties<DepositRequestData>): Promise<DepositResponseData> {
    return this.sendRequest<DepositResponseData>('Deposit', request);
  }

  /**
   * This method returns the details of a payout (works for the {@link TrustlyApiClient#withdraw}, {@link TrustlyApiClient#accountPayout}
   * and {@link TrustlyApiClient#refund} methods).
   */
  public getWithdrawals(request: WithoutProvidedProperties<GetWithdrawalsRequestData>): Promise<GetWithdrawalsResponseResult['data']> {
    return this.sendRequest<GetWithdrawalsResponseResult['data']>('GetWithdrawals', request);
  }

  /**
   * Refunds the customer on a previous {@link TrustlyApiClient#deposit} or {@link TrustlyApiClient#charge}.
   * <p>
   * The Refund will always be made to the same bank account that was used in the original payment.
   * <p>
   * You must have sufficient funds on your merchant account to make the refund. No credit is given. If the deposit has not yet been settled
   * when the refund request is received, the refund will be queued and executed once the money for the deposit has been received.
   */
  public refund(request: WithoutProvidedProperties<RefundRequestData>): Promise<RefundResponseData> {
    return this.sendRequest<RefundResponseData>('Refund', request);
  }

  public createAccount(request: WithoutProvidedProperties<CreateAccountRequestData>): Promise<CreateAccountResponseData> {
    return this.sendRequest<CreateAccountResponseData>('CreateAccount', request);
  }

  /**
   * Initiates a new order where the end-user can select and verify one of his/her bank accounts.
   * <p>
   * You can find more information about how to display the Trustly URL <a href="https://eu.developers.trustly.com/doc/docs/service-presentation">here</a>.
   * <p>
   * When the account has been verified an account notification is immediately sent to the
   * {@link SelectAccountRequestData#NotificationURL}.
   * <p>
   * A typical flow is:
   * <ol>
   *   <li>The merchant makes an API-call to this method and redirects the end-user to {@link SelectAccountResponseData#url}.</li>
   *   <li>The end-user selects his/her bank and completes the identification process.</li>
   *   <li>The end-user is redirected back to the merchant at {@link SelectAccountRequestDataAttributes#SuccessURL}. Note that the account might not be verified yet at this point.</li>
   *   <li>When the account is verified, Trustly sends an account notification to the merchant's system with information about the selected account</li>
   * </ol>
   */
  public selectAccount(request: WithoutProvidedProperties<SelectAccountRequestData>): Promise<SelectAccountResponseData> {
    return this.sendRequest<SelectAccountResponseData>('SelectAccount', request);
  }

  /**
   * Registers and verifies the format of an account to be used in {@link TrustlyApiClient#accountPayout}.
   * <p>
   * A typical payout flow is:
   * <ol>
   *   <li>The merchant makes an API-call to this method and receives an {@link RegisterAccountResponseData#accountid} in response. </li>
   *   <li>The merchant saves the {@code accountid} as a valid payout option for the end user.</li>
   *   <li>
   *     When it's time to actually do a payout the merchant makes an API-call to
   *     {@link TrustlyApiClient#accountPayout} with the {@link AccountPayoutRequestData#Amount},
   *     {@link AccountPayoutRequestData#Currency} and saved {@link RegisterAccountResponseData#accountid}.
   *   </li>
   * </ol>
   * Multiple calls to this method with the same bank account details will result in the same {@link RegisterAccountResponseData#accountid} being returned.
   */
  public registerAccount(request: WithoutProvidedProperties<RegisterAccountRequestData>): Promise<RegisterAccountResponseData> {
    return this.sendRequest<RegisterAccountResponseData>('RegisterAccount', request);
  }

  public registerAccountPayout(request: WithoutProvidedProperties<RegisterAccountPayoutRequestData>): Promise<RegisterAccountPayoutResponseData> {
    return this.sendRequest<RegisterAccountPayoutResponseData>('RegisterAccountPayout', request);
  }

  public merchantSettlement(request: WithoutProvidedProperties<MerchantSettlementRequestData>): Promise<MerchantSettlementResponseData> {
    return this.sendRequest<MerchantSettlementResponseData>('MerchantSettlement', request);
  }

  public settlementReport(request: WithoutProvidedProperties<SettlementReportRequestData>): Promise<SettlementReportResponseDataEntry[]> {

    return this.sendRequest<SettlementReportResponseData>('ViewAutomaticSettlementDetailsCSV', request)
      .then(response => {

        const parser = new SettlementReportParser();
        return parser.parse(response.view_automatic_settlement_details);
      });
  }

  /**
   * Initiates a new withdrawal, returning the URL where the end-user can complete the withdrawal process.
   * <p>
   * You can find more information about how to display the Trustly URL <a href="https://eu.developers.trustly.com/doc/docs/presentation-of-trustly-url">here</a>.
   * <p>
   * A typical withdrawal flow is:
   *
   * <ol>
   *   <li>The merchant sends a Withdraw API call and receives a {@link WithdrawResponseData#url} back from Trustly's API.</li>
   *   <li>The merchant displays {@link WithdrawResponseData#url} to the end-user (you can find more information about how to display it <a href="https://eu.developers.trustly.com/doc/docs/presentation-of-trustly-url">here</a>).</li>
   *   <li>
   *     <span>The end-user selects the amount to withdraw and provides his/her bank account details.</span>
   *     <ul>
   *       <li>If the Withdrawal process is not completed, a {@link NotificationRequest}&lt;{@link CancelNotificationData}&gt; is sent.</li>
   *     </ul>
   *   </li>
   *   <li>
   *     <span>
   *       When the end-user has completed the withdrawal process using the {@link WithdrawResponseData#url},
   *       Trustly sends a {@link NotificationRequest}&lt;{@link DebitNotificationData}&gt; to {@link WithdrawRequestData#NotificationURL}.
   *       The merchant should try to deduct the specified {@link DebitNotificationData#amount} from the end-user's balance in the merchant's system.
   *      </span>
   *     <ul>
   *       <li>If the merchant is able to deduct {@link DebitNotificationData#amount} from the user's balance, the debit notification response should be sent with {@code "status": "OK"}.</li>
   *       <li>
   *         If the merchant is NOT able to deduct {@link DebitNotificationData#amount} from the user's balance, the debit notification response should be sent with {@code "status": "FAILED"}.
   *         The withdrawal is then aborted on Trustly's side and an error message is shown to the end-user. A {@link NotificationRequest}&lt;{@link CancelNotificationData}&gt; is sent to the merchant.
   *       </li>
   *     </ul>
   *   </li>
   *   <li>
   *     (Optional) An {@link NotificationRequest}&lt;{@link AccountNotificationData}&gt; is sent to provide the merchant with more information about the account that was selected by the end user.
   *     This notification is not enabled by default, please reach out to your Trustly contact if you want to receive it.
   *     This information can be used by the merchant to determine if the Withdrawal should be approved or not (see next step).
   *   </li>
   *   <li>
   *     <span>
   *       If manual approval is required, Trustly does nothing with the withdrawal request until it has been approved or denied by the merchant with {@link TrustlyApiClient#approveWithdrawal} / {@link TrustlyApiClient#denyWithdrawal}.
   *       (it is also possible for the merchant to approve or deny the withdrawal in Trustly's backoffice).
   *       Auto-approval can be enabled if requested.
   *     </span>
   *     <ul>
   *       <li>If {@link TrustlyApiClient#denyWithdrawal} is sent, the withdrawal is aborted on Trustly's side and a {@link NotificationRequest}&lt;{@link CancelNotificationData}&gt; and {@link NotificationRequest}&lt;{@link CreditNotificationData}&gt; is sent to the merchant.</li>
   *     </ul>
   *   </li>
   *   <li>If the Withdrawal is approved, Trustly will process the withdrawal.</li>
   *   <li>
   *     (Optional) A {@link NotificationRequest}&lt;{@link PayoutConfirmationNotificationData}&gt; is sent to the merchant when the transfer has been confirmed.
   *     Note: this notification is not enabled by default. Please speak to your Trustly contact if you want to have it enabled.
   *   </li>
   *   <li>If the withdrawal fails, Trustly will send a {@link NotificationRequest}&lt;{@link CreditNotificationData}&gt; notification and a {@link NotificationRequest}&lt;{@link CancelNotificationData}&gt;
   *   (see more details <a href="https://eu.developers.trustly.com/doc/docs/withdraw#failed-withdrawals">here</a>).</li>
   * </ol>
   */
  public withdraw(request: WithoutProvidedProperties<WithdrawRequestData>): Promise<WithdrawResponseData> {
    return this.sendRequest<WithdrawResponseData>('Withdraw', request);
  }

  /**
   * Add a listener for a certain notification type.
   */
  public addNotificationListener<const M extends string>(method: M, listener: NotificationListener<M>): void {

    let meta = this.onNotification.get(method) as unknown as NotificationMeta<M>;
    if (!meta) {
      meta = {
        listeners: [],
      };

      this.onNotification.set(method, meta as unknown as NotificationMeta);
    }

    meta.listeners.push(listener);
  }

  // Base functionality

  /**
   * Used internally to create a request package. You usually do not need to directly call this method unless you are creating a custom
   * request that exist in the documentation but not as a managed type in this class.
   *
   * @param requestData The request data that will be used for the request
   * @param method      The method of the JsonRpc package
   * @param uuid        The UUID for the message, if null one will be generated for you.
   * @param T           The type of the request data
   * @return The JsonRpc response data
   * @throws TrustlyValidationException Thrown if the request does not pass proper validations
   */
  public createRequestPackage<
    M extends string,
    TData extends AbstractRequestData<AbstractRequestDataAttributes>
  >(
    requestData: TData,
    method: M,
    uuid?: string,
  ): JsonRpcRequest<JsonRpcRequestParams<TData>, M> {

    const rpcRequest = this.objectFactory.create(requestData, method, uuid);
    return this.signer.signRequest(rpcRequest);
  }

  /**
   * Used internally to create a response package.
   *
   * @template R The type of the response
   *
   * @param method       The method of the JsonRpc package
   * @param uuid         The UUID for the message, if null one will be generated for you
   * @param responseData The response data that was received remotely
   * @returns {R}        A signed and validated JsonRpc response package
   * @throws TrustlyValidationException Thrown if the response does not pass proper validations
   */
  public createResponsePackage<
    D,
    M extends string = string,
  >(
    method: M,
    uuid: string,
    responseData: D,
  ): JsonRpcResponse<ResponseResult<D, M>> {

    return this.signer.signResponse({
      version: '1.1',
      result: {
        data: responseData,
        method: method,
        uuid: uuid,
      },
    });
  }

  /**
   * Manually send a request to Trustly with the specified data and method and uuid.
   * <p>
   * Should only be used if you need to call an undocumented/newly released method that is not yet added to this library.
   */
  public sendRequest<TResData>(
    method: string,
    requestData: WithoutProvidedProperties<AbstractRequestData<AbstractRequestDataAttributes>>,
    uuid?: string,
  ): Promise<TResData> {

    try {
      return this.sendRequestWithSpecificExceptions(requestData, method, uuid);
    } catch (e) {

      if (e instanceof TrustlyValidationException
        || e instanceof TrustlyErrorResponseException
        || e instanceof TrustlyRejectionException
        || e instanceof TrustlySignatureException) {
        throw new TrustlyRequestException(e);
      } else {
        throw e;
      }
    }
  }

  /**
   * Sends given request to Trustly.
   *
   * @template T The outgoing JsonRpc request data type
   * @template R The expected JsonRpc response data type
   *
   * @param requestData Request to send to Trustly API
   * @param method      The RPC method name of the request
   * @param uuid        Optional UUID for the request. If not specified, one will be generated
   * @returns {R}       Response generated from the request
   * @throws IOException                   If the remote end could not be contacted
   * @throws TrustlyErrorResponseException If the response from Trustly contains an error body
   * @throws TrustlyRejectionException     If the request was rejected by Trustly from their server
   * @throws TrustlySignatureException     If the signature of the request or response could not be verified
   * @throws TrustlyValidationException    If the request or response could not be properly validated
   */
  private async sendRequestWithSpecificExceptions<M extends string, TResData, TReqData extends AbstractRequestData<AbstractRequestDataAttributes>>(
    requestData: WithoutProvidedProperties<TReqData>,
    method: M,
    uuid?: string,
  ): Promise<TResData> {

    const requestWithGlobalProperties = {
      ...requestData,
      Username: this.settings.username,
      Password: this.settings.password,
    } as TReqData;

    const rpcRequest = this.createRequestPackage(requestWithGlobalProperties, method, uuid);

    // TODO: Convert some fields according to special handling -- such as boolean strings ("1", "0")
    const requestString: string = JSON.stringify(rpcRequest);

    const responseString: string = await this.httpRequester.request(this.settings, requestString);

    // TODO: This needs to be validated and done in a better way. How do we know the types?
    const rpcNodeResponse: unknown = JSON.parse(responseString);

    const rpcResponse = rpcNodeResponse as JsonRpcResponse<ResponseResult<TResData, M>> | JsonRpcErrorResponse;

    TrustlyApiClient.assertSuccessful(rpcResponse);
    TrustlyApiClient.assertWithoutRejection(rpcResponse);

    this.signer.verifyResponse(rpcResponse);

    const responseUuid = rpcResponse.result.uuid;

    if (TrustlyStringUtils.isBlank(responseUuid) || responseUuid !== rpcRequest.params?.UUID) {
      throw new TrustlyValidationException(`Incoming UUID is not valid. Expected ${rpcRequest.params?.UUID} but got back ${responseUuid}`);
    }

    return rpcResponse.result.data;
  }

  private static assertWithoutRejection<M extends string, D, TRes extends ResponseResult<D, M>>(rpcResponse: JsonRpcResponse<TRes>): void {

    const obj: unknown = (rpcResponse.result?.data ?? {});
    if (typeof obj == 'object' && obj && 'rejected' in obj) {
      const rejectionResult = obj as WithRejection<unknown, string>;

      if (!rejectionResult.result) {

        let message = rejectionResult.rejected;
        if (TrustlyStringUtils.isBlank(message)) {
          message = 'The request was rejected for an unknown reason';
        }

        throw new TrustlyRejectionException(
          `Received a rejection response from the Trustly API: ${message ?? ''}`,
          rejectionResult.rejected,
        );
      }
    }
  }

  private static assertSuccessful<M extends string, D, TRes extends ResponseResult<D, M>>(rpcResponse: JsonRpcResponse<TRes> | JsonRpcErrorResponse): asserts rpcResponse is JsonRpcResponse<TRes> {

    let message: string | undefined;
    if (rpcResponse.error) {
      message = rpcResponse.error.message;
      if (TrustlyStringUtils.isBlank(message)) {
        message = rpcResponse.error.name;
        if (TrustlyStringUtils.isBlank(message)) {
          message = `${(rpcResponse.error.code ?? -1)}`;
        }
      }
    }

    if (message || !rpcResponse.result) {

      let fullMessage: string;
      if (rpcResponse.error) {
        fullMessage = `Received an error response from the Trustly API: ${message ?? ''}`;
        throw new TrustlyErrorResponseException(fullMessage, undefined, rpcResponse.error);
      } else {
        if (typeof rpcResponse == 'object' && Object.keys(rpcResponse).length > 0) {
          fullMessage = `Received an invalid response without known result from the Trustly API: ${message ?? JSON.stringify(rpcResponse)}`;
        } else {
          fullMessage = `Received a no-result response from the Trustly API: ${message ?? JSON.stringify(rpcResponse)}`;
        }

        throw new TrustlyErrorResponseException(fullMessage, undefined);
      }
    }
  }

  /**
   * Will deserialize, verify and validate the incoming payload for you.
   * <p>
   * It will then call the appropriate notification listeners for this client only. If the incoming notification method does not have a
   * listener, the {@code Unknown} notification listener will be called.
   * <p>
   * It is up to your listener to call the appropriate {@link NotificationArgs#respondWithOk()} or
   * {@link NotificationArgs#respondWithFailed} methods, which will callback to your here given {@code onOK} or {@code onFailed} arguments.
   * <p>
   * It is recommended to <strong>not use this method directly</strong> if possible, and instead use
   * {@link TrustlyApiClientExtensions#handleNotificationRequest} which will call all registered {@link TrustlyApiClient} notification
   * listeners, and handle the servlet request reading and response writing.
   * <p>
   * If you want to handle the reading and writing yourself, then call this method from your own controller or servlet to help with the
   * handling of an incoming notification.
   *
   * @param jsonString The incoming notification as a JSON string
   * @param onResponse The callback which will be executed if a listener calls {@link NotificationArgs#respondWith()}.
   *
   * @throws IOException If the JSON string could not be deserialized or the response could not be sent.
   * @throws TrustlyNoNotificationListenerException If there was no listener for the notification, nor one for unknown ones.
   * @throws TrustlyValidationException If the response data could not be properly validated.
   * @throws TrustlySignatureException If the signature of the response could not be properly verified.
   */
  public async handleNotification<const M extends string>(
    jsonString: string,
    onResponse?: NotificationResponseHandler<M>,
  ): Promise<void> {

    const jsonToken = JSON.parse(jsonString) as Record<string, unknown>;
    let methodValue: string;
    if ('method' in jsonToken && typeof jsonToken.method == 'string') {
      methodValue = jsonToken.method;
    } else {
      methodValue = '';
    }

    let meta = this.onNotification.get(methodValue) as unknown as NotificationMeta<M>;
    if (!meta || meta.listeners.length == 0) {
      console.warn(`There is no listener for incoming notification '${methodValue}'. Will fallback on 'unknown' listener`);
      meta = this.onNotification.get('') as unknown as NotificationMeta<M>;
      if (!meta || meta.listeners.length == 0) {
        return Promise.reject(new TrustlyNoNotificationListenerException(`There is no listener for incoming notification '${methodValue}' nor unknown`));
      }
    }

    const rpcRequest = JSON.parse(jsonString) as JsonRpcNotification<JsonRpcNotificationParams<NotificationTypes[M]>, M>;

    try {

      // Verify the notification (RpcRequest from Trustly) signature.
      this.signer.verifyNotificationRequest(rpcRequest);
    } catch (ex) {
      if (ex instanceof TrustlySignatureException) {
        const msg = 'Could not validate signature of notification from Trustly. Is the public key for Trustly the correct one, for test or production?';
        return Promise.reject(new TrustlySignatureException(msg, ex));
      } else {
        return Promise.reject(ex);
      }
    }

    if (!rpcRequest.params?.data || !rpcRequest.params?.uuid) {
      throw new Error(`Missing data and/or uuid`);
    }

    const args = new NotificationArgs(rpcRequest.method, rpcRequest.params?.data, rpcRequest.params?.uuid, onResponse);

    const promises: Promise<void>[] = [];
    for (const listener of meta.listeners) {
      promises.push(listener(args));
    }

    return Promise.all(promises).then();
  }
}

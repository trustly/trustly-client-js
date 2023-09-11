import {HttpRequesterLoader} from '../request/HttpRequesterLoader';
import {HttpRequester} from '../request/HttpRequester';
import {TrustlyApiClientSettingsData} from './TrustlyApiClientSettings';
import {NodeJsHttpRequesterLoader} from '../request/NodeJsHttpRequesterLoader';
import {IFromTrustlyRequestData} from '../domain/base/IFromTrustlyRequestData';
import {JsonRpcFactory} from './JsonRpcFactory';
import {JsonRpcSigner} from './JsonRpcSigner';
import {JsonRpcValidator} from './JsonRpcValidator';
import {AccountLedgerRequestData} from '../domain/methods/accountledger/AccountLedgerRequestData';
import {AccountLedgerResponseData} from '../domain/methods/accountledger/AccountLedgerResponseData';
import {DefaultJsonRpcSigner} from './DefaultJsonRpcSigner';
import {Serializer} from './Serializer';

import {AccountPayoutRequestData} from '../domain/methods/accountpayout/AccountPayoutRequestData';
import {AccountPayoutResponseData} from '../domain/methods/accountpayout/AccountPayoutResponseData';

import {ApproveWithdrawalRequestData} from '../domain/methods/approvewithdrawal/ApproveWithdrawalRequestData';
import {ApproveWithdrawalResponseData} from '../domain/methods/approvewithdrawal/ApproveWithdrawalResponseData';

import {DenyWithdrawalRequestData} from '../domain/methods/denywithdrawal/DenyWithdrawalRequestData';
import {DenyWithdrawalResponseData} from '../domain/methods/denywithdrawal/DenyWithdrawalResponseData';

import {BalanceRequestData} from '../domain/methods/balance/BalanceRequestData';
import {BalanceResponseData} from '../domain/methods/balance/BalanceResponseData';

import {ChargeRequestData} from '../domain/methods/charge/ChargeRequestData';
import {ChargeResponseData} from '../domain/methods/charge/ChargeResponseData';

import {CreateAccountRequestData} from '../domain/methods/createaccount/CreateAccountRequestData';
import {CreateAccountResponseData} from '../domain/methods/createaccount/CreateAccountResponseData';

import {RegisterAccountRequestData} from '../domain/methods/registeraccount/RegisterAccountRequestData';
import {RegisterAccountResponseData} from '../domain/methods/registeraccount/RegisterAccountResponseData';

import {RegisterAccountPayoutRequestData} from '../domain/methods/registeraccountpayout/RegisterAccountPayoutRequestData';
import {RegisterAccountPayoutResponseData} from '../domain/methods/registeraccountpayout/RegisterAccountPayoutResponseData';

import {SettlementReportRequestData} from '../domain/methods/settlementreport/SettlementReportRequestData';
import {SettlementReportResponseData} from '../domain/methods/settlementreport/SettlementReportResponseData';

import {CreditNotificationData} from '../domain/notifications/CreditNotificationData';
import {CancelNotificationData} from '../domain/notifications/CancelNotificationData';
import {AccountNotificationData} from '../domain/notifications/AccountNotificationData';
import {UnknownNotificationData} from '../domain/notifications/UnknownNotificationData';
import {PendingNotificationData} from '../domain/notifications/PendingNotificationData';
import {PayoutConfirmationNotificationData} from '../domain/notifications/PayoutConfirmationNotificationData';
import {DebitNotificationData} from '../domain/notifications/DebitNotificationData';

import {IToTrustlyRequestParams} from '../domain/base/IToTrustlyRequestParams';
import {IResponseResultData} from '../domain/base/IResponseResultData';
import {IRequestParamsData} from '../domain/base/IRequestParamsData';

import {TrustlyValidationException} from '../domain/exceptions/TrustlyValidationException';
import {TrustlyErrorResponseException} from '../domain/exceptions/TrustlyErrorResponseException';
import {TrustlyRejectionException} from '../domain/exceptions/TrustlyRejectionException';
import {TrustlySignatureException} from '../domain/exceptions/TrustlySignatureException';
import {TrustlyRequestException} from '../domain/exceptions/TrustlyRequestException';

import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {JsonRpcResponse, JsonRpcResponseWithResult} from '../domain/base/JsonRpcResponse';

import {TrustlyStringUtils} from '../util/TrustlyStringUtils';

import {IWithRejectionResult} from '../domain/base/IWithRejectionResult';
import {WithdrawResponseData} from '../domain/methods/withdraw/WithdrawResponseData';
import {WithdrawRequestData} from '../domain/methods/withdraw/WithdrawRequestData';
import {CancelChargeResponseData} from '../domain/methods/cancelcharge/CancelChargeResponseData';
import {CancelChargeRequestData} from '../domain/methods/cancelcharge/CancelChargeRequestData';
import {SelectAccountResponseData} from '../domain/methods/selectaccount/SelectAccountResponseData';
import {SelectAccountRequestData} from '../domain/methods/selectaccount/SelectAccountRequestData';
import {RefundResponseData} from '../domain/methods/refund/RefundResponseData';
import {RefundRequestData} from '../domain/methods/refund/RefundRequestData';
import {DepositResponseData} from '../domain/methods/deposit/DepositResponseData';
import {DepositRequestData} from '../domain/methods/deposit/DepositRequestData';
import {GetWithdrawalsResponseData} from '../domain/methods/getwithdrawals/GetWithdrawalsResponseData';
import {GetWithdrawalsRequestData} from '../domain/methods/getwithdrawals/GetWithdrawalsRequestData';
import {WithoutSignature} from '../domain/base/modifiers/WithoutSignature';

import {NotificationEvent} from './NotificationEvent';
import {NotificationRequest} from '../domain/base/NotificationRequest';

import {NotificationArgs, NotificationFailHandler, NotificationOkHandler} from './NotificationArgs';
import {TrustlyNoNotificationListenerException} from '../domain/exceptions/TrustlyNoNotificationListenerException';
import {WithoutProvidedProperties} from "../domain/base/modifiers/WithoutProvidedProperties";

enum DataClass {
  PLACEHOLDER
}

interface NotificationMeta<D extends IFromTrustlyRequestData> {

  dataClass: DataClass;
  listeners: NotificationEvent<D>[];
}

export class TrustlyApiClient {

  private static readonly STATIC_REGISTERED_CLIENTS: TrustlyApiClient[] = [];

  private static readonly AVAILABLE_HTTP_REQUESTERS: HttpRequesterLoader[] = [
    new NodeJsHttpRequesterLoader(),
  ];

  private static getFirstAvailableHttpRequester(): HttpRequester {

    let foundHttpRequester: HttpRequester | undefined = undefined;
    for (const loader of TrustlyApiClient.AVAILABLE_HTTP_REQUESTERS) {

      foundHttpRequester = loader.create();
      if (foundHttpRequester !== null) {
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
  private readonly validator: JsonRpcValidator = new JsonRpcValidator();
  private readonly httpRequester: HttpRequester;

  private readonly onNotification: Map<string, NotificationMeta<IFromTrustlyRequestData>> = new Map();

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

    TrustlyApiClient.STATIC_REGISTERED_CLIENTS.push(this);
  }

  public close(): void {
    const idx = TrustlyApiClient.STATIC_REGISTERED_CLIENTS.indexOf(this);
    if (idx !== -1) {
      TrustlyApiClient.STATIC_REGISTERED_CLIENTS.splice(idx, 1);
    } else {
      throw new Error(`The closed client was not included among the registered clients`);
    }
  }

  public static getRegisteredClients(): TrustlyApiClient[] {
    return TrustlyApiClient.STATIC_REGISTERED_CLIENTS;
  }

  // Methods

  /**
   * Fetches the account ledger for the specified time period.
   * <p>
   * This report includes all the transactions (both incoming and outgoing transactions) that affect the merchant's Trustly account
   * balance.
   * <p>
   * Only settled transactions are included.
   */
  public accountLedger(request: WithoutProvidedProperties<AccountLedgerRequestData>): Promise<AccountLedgerResponseData> {
    return this.sendRequest<AccountLedgerResponseData>(request, 'AccountLedger');
  }

  /**
   * This method is used by merchants to transfer money to their customer's bank accounts.
   * <p>
   * The merchant specifies the receiving bank account in {@link AccountPayoutRequestData#accountId}, which is a unique identifier
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
   *   <li>The merchant makes an API-call using this method with the {@link AccountPayoutRequestData#amount} and {@link AccountPayoutRequestData#currency} to transfer.</li>
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
   *   <li>Trustly's {@link TrustlyApiClient#registerAccount} API responds with {@link RegisterAccountResponseData#accountId} of the recipient's account.</li>
   *   <li>The merchant makes an API-call to this method with the {@link AccountPayoutRequestData#amount} and {@link AccountPayoutRequestData#currency} to transfer.</li>
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
    return this.sendRequest<AccountPayoutResponseData>(request, 'AccountPayout');
  }

  /**
   * Approves a withdrawal prepared by the user. Please contact your integration manager at Trustly if you want to enable automatic approval
   * of the withdrawals.
   */
  public approveWithdrawal(request: WithoutProvidedProperties<ApproveWithdrawalRequestData>): Promise<ApproveWithdrawalResponseData> {
    return this.sendRequest<ApproveWithdrawalResponseData>(request, 'ApproveWithdrawal');
  }

  /**
   * This method returns the current balance for all currencies available on the merchant's Trustly account.
   * <p>
   * 🚧 Please do not use this method more than once every 15 minutes.
   */
  public balance(request: WithoutProvidedProperties<BalanceRequestData>): Promise<BalanceResponseData> {
    return this.sendRequest<BalanceResponseData>(request, 'Balance');
  }

  /**
   * For {@link TrustlyApiClient#charge} requests that have a future {@link ChargeRequestDataAttributes#paymentDate}, it’s possible to
   * cancel the Charge up until 18:30 on the {@code PaymentDate}.
   * <p>
   * A {@code Charge} request that doesn’t have any {@code PaymentDate} specified cannot be canceled. It’s also not possible to cancel a
   * {@code Charge} request if the {@code PaymentDate} is equal to the date when {@code Charge} request was sent.
   */
  public cancelCharge(request: WithoutProvidedProperties<CancelChargeRequestData>): Promise<CancelChargeResponseData> {
    return this.sendRequest<CancelChargeResponseData>(request, 'CancelCharge');
  }

  /**
   * Charges a specific {@link ChargeRequestData#accountId} using direct debit.
   * <p>
   * A previously approved direct debit mandate must exist on the {@link ChargeRequestData#accountId} (see
   * {@link TrustlyApiClient#selectAccount} for details).
   */
  public charge(request: WithoutProvidedProperties<ChargeRequestData>): Promise<ChargeResponseData> {
    return this.sendRequest<ChargeResponseData>(request, 'Charge');
  }

  /**
   * Denies a withdrawal prepared by the user.
   * <p>
   * Please contact your integration manager at Trustly if you want to enable automatic approval of the withdrawals.
   */
  public denyWithdrawal(request: WithoutProvidedProperties<DenyWithdrawalRequestData>): Promise<DenyWithdrawalResponseData> {
    return this.sendRequest<DenyWithdrawalResponseData>(request, 'DenyWithdrawal');
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
   *     Trustly sends a {@link NotificationRequest}&lt;{@link PendingNotificationData}&gt; to the {@link DepositRequestData#notificationUrl} when the end-user has completed the payment process,
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
    return this.sendRequest<DepositResponseData>(request, 'Deposit');
  }

  /**
   * This method returns the details of a payout (works for the {@link TrustlyApiClient#withdraw}, {@link TrustlyApiClient#accountPayout}
   * and {@link TrustlyApiClient#refund} methods).
   */
  public getWithdrawals(request: WithoutProvidedProperties<GetWithdrawalsRequestData>): Promise<GetWithdrawalsResponseData> {
    return this.sendRequest<GetWithdrawalsResponseData>(request, 'GetWithdrawals');
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
    return this.sendRequest<RefundResponseData>(request, 'Refund');
  }

  public createAccount(request: WithoutProvidedProperties<CreateAccountRequestData>): Promise<CreateAccountResponseData> {
    return this.sendRequest<CreateAccountResponseData>(request, 'CreateAccount');
  }

  /**
   * Initiates a new order where the end-user can select and verify one of his/her bank accounts.
   * <p>
   * You can find more information about how to display the Trustly URL <a href="https://eu.developers.trustly.com/doc/docs/service-presentation">here</a>.
   * <p>
   * When the account has been verified an account notification is immediately sent to the
   * {@link SelectAccountRequestData#notificationUrl}.
   * <p>
   * A typical flow is:
   * <ol>
   *   <li>The merchant makes an API-call to this method and redirects the end-user to {@link SelectAccountResponseData#url}.</li>
   *   <li>The end-user selects his/her bank and completes the identification process.</li>
   *   <li>The end-user is redirected back to the merchant at {@link SelectAccountRequestDataAttributes#successUrl}. Note that the account might not be verified yet at this point.</li>
   *   <li>When the account is verified, Trustly sends an account notification to the merchant's system with information about the selected account</li>
   * </ol>
   */
  public selectAccount(request: WithoutProvidedProperties<SelectAccountRequestData>): Promise<SelectAccountResponseData> {
    return this.sendRequest<SelectAccountResponseData>(request, 'SelectAccount');
  }

  /**
   * Registers and verifies the format of an account to be used in {@link TrustlyApiClient#accountPayout}.
   * <p>
   * A typical payout flow is:
   * <ol>
   *   <li>The merchant makes an API-call to this method and receives an {@link RegisterAccountResponseData#accountId} in response. </li>
   *   <li>The merchant saves the {@code accountid} as a valid payout option for the end user.</li>
   *   <li>
   *     When it's time to actually do a payout the merchant makes an API-call to
   *     {@link TrustlyApiClient#accountPayout} with the {@link AccountPayoutRequestData#amount},
   *     {@link AccountPayoutRequestData#currency} and saved {@link RegisterAccountResponseData#accountId}.
   *   </li>
   * </ol>
   * Multiple calls to this method with the same bank account details will result in the same {@link RegisterAccountResponseData#accountId} being returned.
   */
  public registerAccount(request: WithoutProvidedProperties<RegisterAccountRequestData>): Promise<RegisterAccountResponseData> {
    return this.sendRequest<RegisterAccountResponseData>(request, 'RegisterAccount');
  }

  public registerAccountPayout(request: WithoutProvidedProperties<RegisterAccountPayoutRequestData>): Promise<RegisterAccountPayoutResponseData> {
    return this.sendRequest<RegisterAccountPayoutResponseData>(request, 'RegisterAccountPayout');
  }

  public settlementReport(request: WithoutProvidedProperties<SettlementReportRequestData>): Promise<SettlementReportResponseData> {
    return this.sendRequest<SettlementReportResponseData>(
      request, 'ViewAutomaticSettlementDetailsCSV',
    );
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
   *       Trustly sends a {@link NotificationRequest}&lt;{@link DebitNotificationData}&gt; to {@link WithdrawRequestData#notificationUrl}.
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
    return this.sendRequest<WithdrawResponseData>(request, 'Withdraw');
  }

  // Notifications

  /**
   * Add a custom listener for a certain notification type.
   * <p>
   * This method should only be used if there is no existing {@code addOnXyzListener} method for the notification you want.
   */
  public addNotificationListener<D extends IFromTrustlyRequestData>(method: string, listener: NotificationEvent<D>): void {

    const dataClass: DataClass | undefined = undefined;
    let meta: NotificationMeta<D> | undefined = this.onNotification.get(method);
    if (!meta) {
      meta = {
        dataClass: dataClass ?? DataClass.PLACEHOLDER,
        listeners: [],
      };
    }

    // const meta: NotificationMeta<D> = this.onNotification.computeIfAbsent(method, k => new NotificationMeta(dataClass)) as NotificationMeta<D>;
    if (meta.dataClass != dataClass) {
      throw new Error(`Each notification method must be registered with the same type (${JSON.stringify(dataClass)} vs ${meta.dataClass})`);
    }

    meta.listeners.push(listener);
  }

  public addOnAccountListener(listener: NotificationEvent<AccountNotificationData>): void {
    this.addNotificationListener('account', listener);
  }

  public addOnCancelListener(listener: NotificationEvent<CancelNotificationData>): void {
    this.addNotificationListener('cancel', listener);
  }

  public addOnCreditListener(listener: NotificationEvent<CreditNotificationData>): void {
    this.addNotificationListener('credit', listener);
  }

  public addOnDebitListener(listener: NotificationEvent<DebitNotificationData>): void {
    this.addNotificationListener('debit', listener);
  }

  public addOnPayoutConfirmation(listener: NotificationEvent<PayoutConfirmationNotificationData>): void {
    this.addNotificationListener('payoutconfirmation', listener);
  }

  public addOnPending(listener: NotificationEvent<PendingNotificationData>): void {
    this.addNotificationListener('pending', listener);
  }

  public addOnUnknownNotification(listener: NotificationEvent<UnknownNotificationData>): void {
    this.addNotificationListener('', listener);
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
  public createRequestPackage<T extends IRequestParamsData>(
    requestData: T,
    method: string,
    uuid?: string,
  ): JsonRpcRequest<T> {

    const rpcRequest = this.objectFactory.create(requestData, method, uuid);
    const signedRpcRequest: JsonRpcRequest<T> = this.signer.signRequest(rpcRequest);

    this.validator.validate(signedRpcRequest);

    return signedRpcRequest;
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
  public createResponsePackage<R extends IResponseResultData>(
    method: string,
    uuid: string,
    responseData: R,
  ): JsonRpcResponse<R> {

    const unsignedRpcResponse: WithoutSignature<JsonRpcResponse<R>> = {
      version: '1.1',
      result: {
        data: responseData,
        method: method,
        uuid: uuid,
      },
    };

    const signedResponse: JsonRpcResponse<R> = this.signer.signResponse(unsignedRpcResponse);

    this.validator.validate(signedResponse);

    return signedResponse;
  }

  /**
   * Manually send a request to Trustly with the specified data and method and uuid.
   * <p>
   * Should only be used if you need to call an undocumented/newly released method that is not yet added to this library.
   */
  public sendRequest<R extends IResponseResultData, T extends IToTrustlyRequestParams = IToTrustlyRequestParams>(
    requestData: WithoutProvidedProperties<T>,
    method: string,
    uuid?: string,
  ): Promise<R> {

    try {
      return this.sendRequestWithSpecificExceptions(requestData, method, uuid);
    } catch (e) {

      if (e instanceof TrustlyValidationException || e instanceof TrustlyErrorResponseException || e instanceof TrustlyRejectionException || e instanceof TrustlySignatureException) {
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
  private async sendRequestWithSpecificExceptions<R extends IResponseResultData, T extends IToTrustlyRequestParams>(
    requestData: WithoutProvidedProperties<T>,
    method: string,
    uuid?: string,
  ): Promise<R> {

    const requestWithGlobalProperties = {
      ...requestData,
      username: this.settings.username,
      password: this.settings.password,
    } as T;

    // requestData.username = ;
    // requestData.password = ;

    const rpcRequest: JsonRpcRequest<T> = this.createRequestPackage(requestWithGlobalProperties, method, uuid);

    // TODO: Convert some fields according to special handling -- such as boolean strings ("1", "0")
    const requestString: string = JSON.stringify(rpcRequest); // this.objectMapper.writeValueAsString(rpcRequest);

    const responseString: string = await this.httpRequester.request(this.settings, requestString);

    // TODO: This needs to be validated and done in a better way. How do we know the types?
    const rpcNodeResponse: unknown = JSON.parse(responseString); // this.objectMapper.readTree(responseString);
    // const  javaResponseType: JavaType = this.objectMapper.getTypeFactory().constructParametricType(JsonRpcResponse.class, clazz);
    const rpcResponse: JsonRpcResponse<R> = rpcNodeResponse as JsonRpcResponse<R>; // this.objectMapper.readValue(responseString, javaResponseType);

    TrustlyApiClient.assertSuccessful(rpcResponse);
    TrustlyApiClient.assertWithoutRejection(rpcResponse);

    this.signer.verifyResponse(rpcResponse); //, rpcNodeResponse);

    const responseUuid = rpcResponse.result.uuid; // rpcResponse.result ?  : rpcResponse.error?.error?.uuid;

    // if (rpcResponse.result) {
    //   rpcResponse.result.uuid
    // } else {
    //   const name: string = rpcResponse.error.name;
    // }

    if (TrustlyStringUtils.isBlank(responseUuid) || responseUuid !== rpcRequest.params.uuid) {
      throw new TrustlyValidationException(`Incoming UUID is not valid. Expected ${rpcRequest.params.uuid} but got back ${responseUuid}`);
    }

    return rpcResponse.result.data;
  }

  private static assertWithoutRejection<R extends IResponseResultData>(rpcResponse: JsonRpcResponse<R>): void {

    // instanceof IWithRejectionResult
    const obj: unknown = (rpcResponse.result?.data ?? {});
    if (typeof obj == 'object' && obj && 'rejected' in obj) {
      const rejectionResult = obj as IWithRejectionResult;

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

  private static assertSuccessful<D extends IResponseResultData>(rpcResponse: JsonRpcResponse<D>): asserts rpcResponse is JsonRpcResponseWithResult<D> {

    if (rpcResponse.error || !rpcResponse.result) {

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

      const fullMessage = `Received an error response from the Trustly API: ${message ?? ''}`;
      throw new TrustlyErrorResponseException(fullMessage, undefined, rpcResponse.error);
    }

    // if (!rpcResponse.isSuccessfulResult()) {
    //
    //
    // }
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
   * @param onOK The callback which will be executed if a listener calls {@link NotificationArgs#respondWithOk()}.
   * @param onFailed The callback which will be executed if a listener calls {@link NotificationArgs#respondWithFailed(String)}.
   *
   * @throws IOException If the JSON string could not be deserialized or the response could not be sent.
   * @throws TrustlyNoNotificationListenerException If there was no listener for the notification, nor one for unknown ones.
   * @throws TrustlyValidationException If the response data could not be properly validated.
   * @throws TrustlySignatureException If the signature of the response could not be properly verified.
   */
  public handleNotification<D extends IFromTrustlyRequestData>(
    jsonString: string,
    // meta: NotificationMeta<D>,
    onOK?: NotificationOkHandler,
    onFailed?: NotificationFailHandler,
  ): void {

    const jsonToken = JSON.parse(jsonString) as Record<string, unknown>; // this.objectMapper.readTree(jsonString);
    let methodValue: string;
    if ('method' in jsonToken && typeof jsonToken.method == 'string') {
      methodValue = jsonToken.method;
    } else {
      methodValue = '';
    }

    // const methodValue: string = `${jsonToken['method']}`.toLowerCase(); // .at('/method').asText('').toLowerCase();

    let meta = this.onNotification.get(methodValue);
    if (!meta || meta.listeners.length == 0) {
      console.log(`There is no listener for incoming notification '${methodValue}'. Will fallback on 'unknown' listener`);
      meta = this.onNotification.get('');
      if (!meta || meta.listeners.length == 0) {
        throw new TrustlyNoNotificationListenerException(`There is no listener for incoming notification '${methodValue}' nor unknown`);
      }
    }

    // const [jsonString, meta, onOK, onFailed] = args as [string, TrustlyApiClient.NotificationMeta<D>, NotificationOkHandler, NotificationFailHandler];

    // const javaRequestType: JavaType = this.objectMapper.getTypeFactory().constructParametricType(NotificationRequest.class, meta.getDataClass());
    // const rpcRequest: NotificationRequest<D> = this.objectMapper.readValue(jsonString, javaRequestType);
    // TODO: There needs to be special consideration for some fields here, like the string booleans
    const rpcRequest: NotificationRequest<D> = JSON.parse(jsonString) as NotificationRequest<D>;

    // Verify the notification (RpcRequest from Trustly) signature.
    try {
      this.signer.verifyRequest(rpcRequest);
    } catch (ex) {
      if (ex instanceof TrustlySignatureException) {
        const msg = 'Could not validate signature of notification from Trustly. Is the public key for Trustly the correct one, for test or production?';
        throw new TrustlySignatureException(msg, ex);
      } else {
        throw ex;
      }
    }

    // Validate the incoming request instance.
    // Most likely this will do nothing, since we are lenient on things sent from Trustly server.
    // But we do this in case anything is needed to be validated on the local domain classes in the future.
    this.validator.validate(rpcRequest);

    const args: NotificationArgs<D> = new NotificationArgs(
      rpcRequest.params.data,
      rpcRequest.method,
      rpcRequest.params.uuid,
      onOK,
      onFailed,
    );

    try {

      for (const listener of meta.listeners) {
        listener.onNotification(args);
      }
    } catch (ex) {

      const message = this.settings.includeExceptionMessageInNotificationResponse
        ? ((ex instanceof Error) ? ex.message : JSON.stringify(ex))
        : '';

      if (onFailed) {
        onFailed(rpcRequest.method, rpcRequest.params.uuid, message);
      }
    }
  }
}

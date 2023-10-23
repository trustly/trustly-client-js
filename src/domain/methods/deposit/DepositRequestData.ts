import {DepositRequestDataAttributes} from './DepositRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';

type DepositAttributes = AbstractToTrustlyRequestData<DepositRequestDataAttributes>;
type RequiredDepositAttributes =
  DepositAttributes
  & Required<Pick<AbstractToTrustlyRequestData<DepositRequestDataAttributes>, 'Attributes'>>;

export interface DepositRequestData extends RequiredDepositAttributes {

  NotificationURL: string;

  EndUserID: string;

  MessageID: string;
}

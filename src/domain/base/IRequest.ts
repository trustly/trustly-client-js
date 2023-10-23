import {IRequestParams} from './IRequestParams';
import {IData} from './IData';
import {NotificationRequestParams} from "./NotificationRequestParams";
import {IFromTrustlyRequestData} from "./IFromTrustlyRequestData";

export interface IRequest<P extends IRequestParams<IData> | NotificationRequestParams<IFromTrustlyRequestData>> {

  method: string;

  version: number;

  params: P;
}

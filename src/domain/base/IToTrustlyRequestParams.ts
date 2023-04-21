import {IRequestParamsData} from './IRequestParamsData';

export interface IToTrustlyRequestParams extends IRequestParamsData {

  /**
   * You do not have to set this property. It is set automatically by the API Client.
   */
  username: string;

  /**
   * You do not have to set this property. It is set automatically by the API Client.
   */
  password: string;
}

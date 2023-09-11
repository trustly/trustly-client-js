import {IRequestParamsData} from './IRequestParamsData';

export interface ICredentialParams {

  /**
   * You do not have to set this property. It is set automatically by the API Client.
   */
  username: string;

  /**
   * You do not have to set this property. It is set automatically by the API Client.
   */
  password: string;
}

export interface IToTrustlyRequestParams extends IRequestParamsData, ICredentialParams {
  
}

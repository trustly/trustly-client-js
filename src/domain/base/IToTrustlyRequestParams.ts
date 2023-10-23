import {IRequestParamsData} from './IRequestParamsData';

export interface ICredentialParams {

  /**
   * You do not have to set this property. It is set automatically by the API Client.
   */
  Username: string;

  /**
   * You do not have to set this property. It is set automatically by the API Client.
   */
  Password: string;
}

export interface IToTrustlyRequestParams extends IRequestParamsData, ICredentialParams {
  
}

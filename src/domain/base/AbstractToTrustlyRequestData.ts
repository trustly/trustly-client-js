import {AbstractRequestParamsDataAttributes} from './AbstractRequestParamsDataAttributes';
import {IToTrustlyRequestParams} from './IToTrustlyRequestParams';

export interface AbstractToTrustlyRequestData<A extends AbstractRequestParamsDataAttributes> extends IToTrustlyRequestParams {

  // username?: string;

  // password?: string;

  attributes?: A;

  // getPassword(): string | undefined {
  //   return this.password;
  // }
  //
  // getUsername(): string | undefined {
  //   return '';
  // }
  //
  // setPassword(value: string): void {
  //   this.password = value;
  // }
  //
  // setUsername(value: string): void {
  //   this.username = value;
  // }
}

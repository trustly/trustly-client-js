import {AbstractRequestParamsDataAttributes} from './AbstractRequestParamsDataAttributes';
import {IToTrustlyRequestParams} from './IToTrustlyRequestParams';

export interface AbstractToTrustlyRequestData<A extends AbstractRequestParamsDataAttributes> extends IToTrustlyRequestParams {

  Attributes?: A;
}

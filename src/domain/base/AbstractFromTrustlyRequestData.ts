import {AbstractRequestParamsDataAttributes} from './AbstractRequestParamsDataAttributes';
import {IFromTrustlyRequestData} from './IFromTrustlyRequestData';

export interface AbstractFromTrustlyRequestData<A extends AbstractRequestParamsDataAttributes> extends IFromTrustlyRequestData {

  attributes?: A;
}

import {AbstractResponseResultData} from './AbstractResponseResultData';

export interface ResponseErrorData extends AbstractResponseResultData {

  code?: number;

  message?: string;

  // constructor() {
  //   super();
  //   // this.code = -1;
  // }
}

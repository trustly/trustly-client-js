import {AnnotationsValidatorLoader} from './AnnotationsValidatorLoader';
import {AnnotationsValidator} from './AnnotationsValidator';
import {DefaultAnnotationsValidator} from './DefaultAnnotationsValidator';

export class DefaultAnnotationsValidatorLoader implements AnnotationsValidatorLoader {

  public create(): AnnotationsValidator {
    return new DefaultAnnotationsValidator();
  }
}

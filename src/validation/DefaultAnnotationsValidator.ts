import {AnnotationsValidator} from './AnnotationsValidator';
import {ValidationResult} from './ValidationResult';

export class DefaultAnnotationsValidator implements AnnotationsValidator {

  private static readonly EMPTY_VALIDATION_RESULTS: ValidationResult[] = [];

  public validate<T>(obj: T): ValidationResult[] {

    console.log(`${JSON.stringify(obj)}`);
    return DefaultAnnotationsValidator.EMPTY_VALIDATION_RESULTS;
  }
}

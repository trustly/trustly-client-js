import {ValidationResult} from './ValidationResult';

export interface AnnotationsValidator {

  validate<T>(obj: T): ValidationResult[];
}

import {AnnotationsValidator} from './AnnotationsValidator';

export interface AnnotationsValidatorLoader {

  create(): AnnotationsValidator;
}

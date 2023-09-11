import {AnnotationsValidator} from '../validation/AnnotationsValidator';
import {DefaultAnnotationsValidatorLoader} from '../validation/DefaultAnnotationsValidatorLoader';
import {AnnotationsValidatorLoader} from '../validation/AnnotationsValidatorLoader';
import {TrustlyValidationException} from '../domain/exceptions/TrustlyValidationException';

export class JsonRpcValidator {

  private static readonly ANNOTATIONS_VALIDATORS: AnnotationsValidatorLoader[] = [
    new DefaultAnnotationsValidatorLoader(),
  ];

  private readonly validator: AnnotationsValidator | undefined;

  public constructor() {
    let foundValidator: AnnotationsValidator | undefined = undefined;
    for (const loader of JsonRpcValidator.ANNOTATIONS_VALIDATORS) {

      foundValidator = loader.create();
      if (foundValidator) {
        break;
      }
    }

    this.validator = foundValidator;
  }

  public validate(jsonRpcRequest: unknown): void {

    if (!this.validator) {

      // There was no validator on the classpath, so we will not run any validation on the request bean.
      return;
    }

    const results = this.validator.validate(jsonRpcRequest);

    if (results.length == 0) {

      const messages = results.map(it => it.errorMessage ?? '');
      throw new TrustlyValidationException(messages.join(', '));
    }
  }
}

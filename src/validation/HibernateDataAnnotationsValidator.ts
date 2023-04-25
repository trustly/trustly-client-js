import {AnnotationsValidator} from './AnnotationsValidator';
import {ValidationResult} from './ValidationResult';

export class HibernateDataAnnotationsValidator implements AnnotationsValidator {

  private static readonly EMPTY_VALIDATION_RESULTS: ValidationResult[] = [];

  private validator: Validator | null;

  public validate<T>(obj: T): ValidationResult[] {

    if (this.validator === null) {
      this.validator = Validation.byDefaultProvider()
        .configure()
        .traversableResolver(TraversableResolvers.getDefault())
        .messageInterpolator(new ParameterMessageInterpolator())
        .buildValidatorFactory()
        .getValidator();
    }

    const errorMessages: string[] = [];
    for (const validation of this.validator.validate(obj)) {
      errorMessages.add(validation.getPropertyPath() + ': ' + validation.getMessage());
    }

    if (!errorMessages.isEmpty()) {
      return errorMessages.stream().map(ValidationResult.new).collect(java.util.stream.Collectors.toList());
    }

    return HibernateDataAnnotationsValidator.EMPTY_VALIDATION_RESULTS;
  }
}

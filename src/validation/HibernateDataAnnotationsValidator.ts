


import { java, JavaObject } from "jree";




export  class HibernateDataAnnotationsValidator extends JavaObject extends  AnnotationsValidator {

  private static readonly EMPTY_VALIDATION_RESULTS:  java.util.List<ValidationResult> | null = java.util.Collections.unmodifiableList(new  java.util.ArrayList());

  private validator:  Validator | null;

  public validate <T>(obj: T| null):  java.util.List<ValidationResult> | null {

    if (this.validator === null) {
      this.validator = Validation.byDefaultProvider()
        .configure()
        .traversableResolver(TraversableResolvers.getDefault())
        .messageInterpolator(new  ParameterMessageInterpolator())
        .buildValidatorFactory()
        .getValidator();
    }

    const  errorMessages: java.util.List<string> = new  java.util.ArrayList();
    for (const validation of this.validator.validate(obj)) {
      errorMessages.add(validation.getPropertyPath() + ": " + validation.getMessage());
    }

    if (!errorMessages.isEmpty()) {
      return errorMessages.stream().map(ValidationResult.new).collect(java.util.stream.Collectors.toList());
    }

    return HibernateDataAnnotationsValidator.EMPTY_VALIDATION_RESULTS;
  }
}

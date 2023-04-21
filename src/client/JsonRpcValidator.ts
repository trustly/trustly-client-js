


import { java, JavaObject } from "jree";




export  class JsonRpcValidator extends JavaObject {

  private static readonly ANNOTATIONS_VALIDATORS:  AnnotationsValidatorLoader[] | null =  [
    new  HibernateDataAnnotationsValidatorLoader()
  ];

  private readonly validator:  AnnotationsValidator | null;

  public constructor() {

    super();
let  foundValidator: AnnotationsValidator = null;
    for (let loader of JsonRpcValidator.ANNOTATIONS_VALIDATORS) {

      foundValidator = loader.create();
      if (foundValidator !== null) {
        break;
      }
    }

    this.validator = foundValidator;
  }

  public validate(jsonRpcRequest: java.lang.Object| null):  void {

    if (this.validator === null) {

      // There was no validator on the classpath, so we will not run any validation on the request bean.
      return;
    }

    let  results: java.util.List<ValidationResult> = this.validator.validate(jsonRpcRequest);

    if (!results.isEmpty()) {

      let  messages: string[] = results.stream().map(ValidationResult.getErrorMessage).toArray(string[].new);
      throw new  TrustlyValidationException(string.join(", ", messages));
    }
  }
}

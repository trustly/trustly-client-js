import {AnnotationsValidatorLoader} from './AnnotationsValidatorLoader';
import {AnnotationsValidator} from './AnnotationsValidator';
import {HibernateDataAnnotationsValidator} from './HibernateDataAnnotationsValidator';


export class HibernateDataAnnotationsValidatorLoader implements AnnotationsValidatorLoader {

  public create(): AnnotationsValidator {

    try {
      java.lang.Class.forName('org.hibernate.validator.HibernateValidator');
      return new HibernateDataAnnotationsValidator();
    } catch (ignored) {
      if (ignored instanceof java.lang.Throwable) {
        return null;
      } else {
        throw ignored;
      }
    }
  }
}

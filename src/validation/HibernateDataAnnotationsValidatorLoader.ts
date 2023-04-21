
import { java, JavaObject } from "jree";




export  class HibernateDataAnnotationsValidatorLoader extends JavaObject extends  AnnotationsValidatorLoader {

  public create():  AnnotationsValidator | null {

    try {
      java.lang.Class.forName("org.hibernate.validator.HibernateValidator");
      return new  HibernateDataAnnotationsValidator();
    } catch (ignored) {
if (ignored instanceof java.lang.Throwable) {
      return null;
    } else {
	throw ignored;
	}
}
  }
}

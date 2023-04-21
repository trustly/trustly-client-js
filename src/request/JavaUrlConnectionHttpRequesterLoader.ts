
import { java, JavaObject } from "jree";




export  class JavaUrlConnectionHttpRequesterLoader extends JavaObject extends  HttpRequesterLoader {

  public create():  HttpRequester | null {
    return new  JavaUrlConnectionHttpRequester();
  }
}

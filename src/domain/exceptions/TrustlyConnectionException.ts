
import { java, S } from "jree";




export  class TrustlyConnectionException extends AbstractTrustlyApiException {

  public constructor(message: string| null);

  public constructor(message: string| null, cause: java.lang.Exception| null);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [message] = args as [string];


    super(message);
  

				break;
			}

			case 2: {
				const [message, cause] = args as [string, java.lang.Exception];


    super(message, cause);
  

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

}

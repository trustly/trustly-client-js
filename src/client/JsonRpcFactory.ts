import {java, JavaObject, S} from 'jree';
import {JsonRpcRequest} from '../domain/base/JsonRpcRequest';
import {IRequestParamsData} from '../domain/base/IRequestParamsData';
import {RequestParams} from '../domain/base/RequestParams';


export class JsonRpcFactory extends JavaObject {

  public create<D extends IRequestParamsData>(requestData: D | null, method: string | null): JsonRpcRequest<D> | null;

  public create<D extends IRequestParamsData>(requestData: D | null, method: string | null, uuid: string | null): JsonRpcRequest<D> | null;
  public create<D extends IRequestParamsData>(...args: unknown[]): JsonRpcRequest<D> | null {
    switch (args.length) {
      case 2: {
        const [requestData, method] = args as [D, string];
        return this.create(requestData, method, null);
        break;
      }

      case 3: {
        const [requestData, method, uuid] = args as [D, string, string];


        if (uuid === null) {
          uuid = java.util.UUID.randomUUID().toString();
        }

        return JsonRpcRequest. < D > builder()
          .method(method)
          .params(
            RequestParams. < D > builder()
              .uuid(uuid)
              .data(requestData)
              .build(),
          )
          .build();


        break;
      }

      default: {
        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
      }
    }
  }

}

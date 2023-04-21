


import { java, JavaObject, int, S } from "jree";




export  class Serializer extends JavaObject {

  private readonly objectMapper:  ObjectMapper | null = new  ObjectMapper();

  public serializeData <D extends IData>(data: D| null):  string | null {

    const  jsonObject: JsonNode = this.objectMapper.valueToTree(data);

    const  sb: java.lang.StringBuilder = new  java.lang.StringBuilder();
    this.serializeNode(jsonObject, sb);

    return sb.toString();
  }

  public serializeNode(node: TreeNode| null)?: string;

  private serializeNode(node: TreeNode| null, sb: java.lang.StringBuilder| null):  void;
public serializeNode(...args: unknown[]):  string | null |  void {
		switch (args.length) {
			case 1: {
				const [node] = args as [TreeNode];



    const  sb: java.lang.StringBuilder = new  java.lang.StringBuilder();
    this.serializeNode(node, sb);

    return sb.toString();
  

				break;
			}

			case 2: {
				const [node, sb] = args as [TreeNode, java.lang.StringBuilder];


    if (node instanceof ObjectNode) {
      this.serializeObjectNode( node as ObjectNode, sb);
    } else if (node instanceof ValueNode) {
      Serializer.serializeValueNode( node as ValueNode, sb);
    } else {
      this.serializeOtherNode(node, sb);
    }
  

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


  private serializeObjectNode(objectNode: ObjectNode| null, sb: java.lang.StringBuilder| null):  void {
    const  fieldNames: java.util.List<string> = this.iteratorToList(objectNode.fieldNames());
    fieldNames.sort(java.util.Comparator.naturalOrder());

    for (const fieldName of fieldNames) {

      const  propertyBuffer: java.lang.StringBuilder = new  java.lang.StringBuilder();
      this.serializeNode(objectNode.get(fieldName), propertyBuffer);

      sb.append(fieldName);
      sb.append(propertyBuffer);
    }
  }

  private static serializeValueNode(valueNode: ValueNode| null, sb: java.lang.StringBuilder| null):  void {
    if (valueNode.isNull()) {
      // If null, then we do not append anything. It becomes an empty string.
    } else {
      sb.append(valueNode.asText());
    }
  }

  private serializeOtherNode(treeNode: TreeNode| null, sb: java.lang.StringBuilder| null):  void {
    if (treeNode.isArray()) {
      for (let  i: int = 0; i < treeNode.size(); i++) {
        this.serializeNode(treeNode.get(i), sb);
      }
    } else {
      for (const fieldName of this.iteratorToList(treeNode.fieldNames())) {
        this.serializeNode(treeNode.get(fieldName), sb);
      }
    }
  }

  private iteratorToList <T>(it: java.util.Iterator<T>| null):  java.util.List<T> | null {

    const  list: java.util.List<T> = new  java.util.ArrayList();
    while (it.hasNext()) {
      list.add(it.next());
    }

    return list;
  }
}

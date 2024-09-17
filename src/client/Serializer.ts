
export class Serializer {

  public serializeData<D extends object>(data: D | undefined): string {
    return this.serializeNode(data);
  }

  public serializeNode(node: unknown): string {

    if (Array.isArray(node)) {
      return node.map(it => this.serializeNode(it)).join('');
    } else if (typeof node === 'object' && node) {

      const keys = Object.keys(node);
      keys.sort((a, b) => a.localeCompare(b));

      return keys.map(k => {
        const v = (node as Record<string, unknown>)[k];
        return `${k}${this.serializeNode(v)}`;
      }).join('');

    } else if (typeof node == 'string' || typeof node == 'number' || typeof node == 'bigint') {
      return `${node}`;
    } else if (typeof node == 'boolean') {
      return node ? 'true' : 'false';
    } else {
      throw new Error(`Do not know how to handle '${JSON.stringify(node)}'`);
    }
  }
}

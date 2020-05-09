export function mapToJson<K,V>(map: Map<K, V>): string {
  return JSON.stringify([...map]);
}

export function jsonToMap<K,V>(jsonStr: string): Map<K,V> {
  return new Map(JSON.parse(jsonStr));
}
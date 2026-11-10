import { BlockList, isIP } from "node:net";
import { readFileSync } from "node:fs";

// APNIC allocation country is an approximation of location, not a city lookup.
// Keep the registry snapshot locally: visitor IPs never go to a lookup service.
const mainland = new BlockList();
const registry = JSON.parse(readFileSync(new URL("../resources/cn-networks.json", import.meta.url), "utf8"));
for (const cidr of registry.networks) {
  const [address, prefix] = cidr.split("/");
  mainland.addSubnet(address, Number(prefix), isIP(address) === 6 ? "ipv6" : "ipv4");
}

export function allocatedCountry(ip) {
  const normalized = ip.replace(/^::ffff:/u, "");
  const version = isIP(normalized);
  if (!version) return null;
  return mainland.check(normalized, version === 6 ? "ipv6" : "ipv4") ? "CN" : null;
}

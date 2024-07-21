import type { Timestamp } from "@bufbuild/protobuf";

export function timestampToDate(
  timestamp: Timestamp | undefined,
): Date | undefined {
  if (!timestamp) {
    return undefined;
  }
  const milliseconds =
    BigInt(timestamp.seconds) * BigInt(1000) +
    BigInt(timestamp.nanos) / BigInt(1000000);
  return new Date(new Date(Number(milliseconds)).getTime());
}

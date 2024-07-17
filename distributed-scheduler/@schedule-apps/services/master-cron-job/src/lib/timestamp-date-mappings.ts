import type { Timestamp } from "@bufbuild/protobuf";

export function dateToTimestamp(date: Date | null): { seconds: number, nanos: number } | undefined {
    if (!date) {
        return undefined;
    }
    const timestamp = { seconds: 0, nanos: 0 };
    const oDate = new Date(date);
    timestamp.seconds = Number(BigInt(Math.floor(oDate.getTime() / 1000)));
    timestamp.nanos = (oDate.getTime() % 1000) * 1000000;

    return timestamp;
}
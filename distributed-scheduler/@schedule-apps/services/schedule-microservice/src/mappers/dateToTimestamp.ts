import { Timestamp } from "@bufbuild/protobuf";

export function dateToTimestamp(date: Date | null): Timestamp | undefined {
    if (!date) {
        return undefined;
    }
    const timestamp = new Timestamp();
    timestamp.seconds = BigInt(Math.floor(date.getTime() / 1000));
    timestamp.nanos = (date.getTime() % 1000) * 1000000;

    console.log({ date, timestamp: JSON.stringify(timestamp) })

    return timestamp;
}
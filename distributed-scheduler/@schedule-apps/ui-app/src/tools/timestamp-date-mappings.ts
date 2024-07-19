import { Timestamp } from "@bufbuild/protobuf";

export function timestampToDate(timestamp: Timestamp | undefined): Date | undefined {
    if (!timestamp) {
        return undefined;
    }
    const milliseconds = BigInt(timestamp.seconds) * BigInt(1000) + BigInt(timestamp.nanos) / BigInt(1000000);
    return new Date(Number(milliseconds));
}

export function dateToTimestamp(sDate: Date | null): Timestamp | undefined {
    if (!sDate) {
        return undefined;
    }
    const timestamp = new Timestamp();
    const date = new Date(sDate);
    console.log({ lbl: "my-mate", date, sDate });
    timestamp.seconds = BigInt(Math.floor(date.getTime() / 1000));
    timestamp.nanos = (date.getTime() % 1000) * 1000000;

    return timestamp;
}
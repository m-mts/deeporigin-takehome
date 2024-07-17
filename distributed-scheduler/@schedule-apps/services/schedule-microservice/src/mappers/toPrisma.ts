import { Frequency, ExecutorType } from "@schedule-repo/definitions";

export type FrequencyDB = "Once" | "Recurring";
export function frequencyMapper(val: Frequency): FrequencyDB {
    const map = new Map<Frequency, string>([
        [ Frequency.Once, "Once" ],
        [ Frequency.Recurring, "Recurring" ]
    ]);
    if (!map.has(val)) {
        throw new Error(`Frequency "${val}" not found`);
    }

    return map.get(val) as FrequencyDB;
}

type ExecutorTypeDB = 'shell' | 'http';
export function executorTypeMapper(val: ExecutorType): ExecutorTypeDB {
    const map = new Map<ExecutorType, ExecutorTypeDB>([
        [ ExecutorType.shell, 'shell' ],
        [ ExecutorType.http, 'http' ]
    ]);
    if (!map.has(val)) {
        throw new Error(`Executor type "${val}" not found`);
    }
    return map.get(val) as ExecutorTypeDB;
}
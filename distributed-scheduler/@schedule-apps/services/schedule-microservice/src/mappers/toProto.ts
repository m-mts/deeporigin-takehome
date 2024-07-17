import { Frequency, ExecutorType, Status as StatusType } from "@schedule-repo/definitions";

type FrequencyDB = "Once" | "Recurring";
export function frequencyMapper(val: FrequencyDB): Frequency {
    const map = new Map<FrequencyDB, Frequency>([
        [ "Once", Frequency.Once ],
        [ "Recurring", Frequency.Recurring ]
    ]);
    if (!map.has(val)) {
        throw new Error(`Frequency "${val}" not found`);
    }

    return map.get(val) as Frequency;
}

type ExecutorTypeDB = 'shell' | 'http';
export function executorTypeMapper(val: ExecutorTypeDB): ExecutorType {
    const map = new Map<ExecutorTypeDB, ExecutorType>([
        [ 'shell', ExecutorType.shell ],
        [ 'http', ExecutorType.http ]
    ]);
    if (!map.has(val)) {
        throw new Error(`Executor type "${val}" not found`);
    }
    return map.get(val) as ExecutorType;
}


type StatusTypeDB = 'InQueue' | 'Started' | 'Finished' | 'Failed';
export function statusTypeMapper(val: StatusTypeDB): StatusType {
    const map = new Map<StatusTypeDB, StatusType>([
        [ 'InQueue', StatusType.InQueue ],
        [ 'Started', StatusType.Started ],
        [ 'Finished', StatusType.Finished ],
        [ 'Failed', StatusType.Failed ]
    ]);
    if (!map.has(val)) {
        throw new Error(`Status type "${val}" not found`);
    }
    return map.get(val) as StatusType;
}
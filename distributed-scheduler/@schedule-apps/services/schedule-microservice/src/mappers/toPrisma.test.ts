import { describe, expect, test } from "bun:test";
import { frequencyMapper, executorTypeMapper } from './toPrisma';
import { Frequency, ExecutorType } from "@schedule-repo/definitions";

describe('frequencyMapper', () => {
    test('should map Frequency "Once" to FrequencyDB "Once"', () => {
        const result = frequencyMapper(Frequency.Once);
        expect(result).toBe('Once');
    });

    test('should map Frequency "Recurring" to FrequencyDB "Recurring"', () => {
        const result = frequencyMapper(Frequency.Recurring);
        expect(result).toBe('Recurring');
    });

    test('should throw an error for unknown Frequency', () => {
        expect(() => frequencyMapper('unknown' as unknown as Frequency)).toThrowError('Frequency "unknown" not found');
    });
});

describe('executorTypeMapper', () => {
    test('should map ExecutorType "shell" to ExecutorTypeDB "shell"', () => {
        const result = executorTypeMapper(ExecutorType.shell);
        expect(result).toBe('shell');
    });

    test('should map ExecutorType "http" to ExecutorTypeDB "http"', () => {
        const result = executorTypeMapper(ExecutorType.http);
        expect(result).toBe('http');
    });

    test('should throw an error for unknown ExecutorType', () => {
        expect(() => executorTypeMapper('unknown' as unknown as ExecutorType)).toThrowError('Executor type "unknown" not found');
    });
});
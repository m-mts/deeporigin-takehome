import { describe, expect, test } from "vitest";
import validateJSON, { isValidHTTPMethod, isValidHeader, isValidURL } from "@/tools/json-executor-properties-validator";

describe("JSON Executor Properties Validator", () => {
    test("should return true for valid JSON input", () => {
        const validInput = `{
            "url": "https://example.com",
            "method": "GET"
        }`;
        const isValid = validateJSON(validInput);
        expect(isValid).toBe(true);
    });

    test("should return false for invalid JSON input", () => {
        const invalidInput = `{
            "url": "https://example.com",
            "method": "INVALID_METHOD"
        }`;
        expect(() => validateJSON(invalidInput)).toThrowError(new Error("Invalid HTTP method. Allowed methods are: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS."));
    });

    test("should return true for valid URL", () => {
        const validURL = "https://example.com";
        const isValid = isValidURL(validURL);
        expect(isValid).toBe(true);
    });

    test("should return false for invalid URL", () => {
        const invalidURL = "example.com";
        const isValid = isValidURL(invalidURL);
        expect(isValid).toBe(false);
    });

    test("should return true for valid HTTP method", () => {
        const validMethod = "GET";
        const isValid = isValidHTTPMethod(validMethod);
        expect(isValid).toBe(true);
    });

    test("should return false for invalid HTTP method", () => {
        const invalidMethod = "INVALID_METHOD";
        const isValid = isValidHTTPMethod(invalidMethod);
        expect(isValid).toBe(false);
    });

    test("should return true for valid header", () => {
        const validHeader = { "Content-Type": "application/json" };
        const isValid = isValidHeader(validHeader);
        expect(isValid).toBe(true);
    });

    test("should return false for invalid header", () => {
        const invalidHeader = {};
        const isValid = isValidHeader(invalidHeader);
        expect(isValid).toBe(false);
    });
});
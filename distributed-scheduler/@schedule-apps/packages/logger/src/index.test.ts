import { expect, test } from "bun:test";
import type { ILogObj } from "tslog";
import { Logger } from "tslog";
import { getLogger } from "./index";

test("getLogger should return an instance of Logger<ILogObj>", () => {
  const logger = getLogger("test");
  expect(logger).toBeInstanceOf(Logger<ILogObj>);
});

test("getLogger should return a logger with the provided descriptor", () => {
  const descriptor = "test";
  const logger: Logger<ILogObj> = getLogger(descriptor);
  expect(logger.settings.name).toBe(descriptor);
});

test("getLogger should return a logger with default min level", () => {
  const logger = getLogger("test");
  expect(logger.settings.minLevel).toBe(0);
});

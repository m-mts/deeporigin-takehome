import type { ILogObj } from "tslog";
import { Logger } from "tslog";

type AppLogger = Logger<ILogObj>;

export const getLogger = (descriptor: string): AppLogger => {
  return new Logger({ name: descriptor });
};

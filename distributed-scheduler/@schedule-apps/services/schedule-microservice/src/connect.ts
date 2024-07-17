import type { ConnectRouter } from "@connectrpc/connect";
import { ScheduleService } from "@schedule-repo/definitions/schedule";
import { getLogger } from "../../../packages/logger/dist";
import * as actions from "./connect-actions";
export const logger = getLogger("schedule-service:connect-routers");

export default (router: ConnectRouter) => {
	router.rpc(ScheduleService, ScheduleService.methods.getScheduleBy, actions.getScheduleBy);
	router.rpc(ScheduleService, ScheduleService.methods.getSchedule, actions.getSchedule);

	router.rpc(ScheduleService, ScheduleService.methods.enableSchedule, actions.enableSchedule);
	router.rpc(ScheduleService, ScheduleService.methods.disableSchedule, actions.disableSchedule);

	router.rpc(ScheduleService, ScheduleService.methods.deleteSchedule, actions.deleteSchedule);
	router.rpc(ScheduleService, ScheduleService.methods.addSchedule, actions.addSchedule);
	router.rpc(ScheduleService, ScheduleService.methods.updateSchedule, actions.updateSchedule);

	router.rpc(ScheduleService, ScheduleService.methods.planExecution, actions.planExecution);
};

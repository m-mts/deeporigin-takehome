import Dashboard from "@/app/components/dashboard/dashboard";
import { Schedule } from "@/app/components/schedule/schedule";

export default function DashboardPage() {
	return (
		<Dashboard data-testid="dashboard">
			<Schedule data-testid="schedule" />
		</Dashboard>
	);
}

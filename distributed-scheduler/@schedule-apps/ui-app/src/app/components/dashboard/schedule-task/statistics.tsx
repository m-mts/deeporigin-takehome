import type { Statistics } from "@/types/schedule";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SmsFailedIcon from "@mui/icons-material/SmsFailed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
export default async function StatisticsView({
	statistics,
}: { statistics: Statistics }) {
	const percentage = Math.round(
		(statistics.successCount / Math.max(statistics.taskRunsCount, 1)) * 100,
	);

	return (
		<div className="stats shadow w-full mb-12">
			<div className="stat">
				<div className="stat-figure text-primary">
					<SportsScoreIcon />
				</div>
				<div className="stat-title">Total</div>
				<div className="stat-value text-primary">
					{statistics.taskRunsCount}
				</div>
				<div className="stat-desc">{statistics.currentStatus}</div>
			</div>

			<div className="stat">
				<div className="stat-figure text-success">
					<FavoriteIcon />
				</div>
				<div className="stat-title">Success</div>
				<div className="stat-value text-success">{statistics.successCount}</div>
				<div className="stat-desc">{statistics.lastSuccess?.toString()}</div>
			</div>

			<div className="stat">
				<div className="stat-figure text-error">
					<SmsFailedIcon />
				</div>
				<div className="stat-title">Failure</div>
				<div className="stat-value text-error">{statistics.errorCount}</div>
				<div className="stat-desc">{statistics.lastError?.toString()}</div>
			</div>

			<div className="stat">
				<div className="stat-figure text-warning">
					<TrendingUpIcon />
				</div>
				<div className="stat-title">Success rate</div>
				<div className="stat-value text-warning">{percentage}%</div>
			</div>
		</div>
	);
}

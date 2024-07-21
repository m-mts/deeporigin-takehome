"use client";

import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import disable from "./actions/disable";

export const EnabledButton = ({
	itemId,
	onChanged = () => {},
}: Partial<{ itemId: string; onChanged: () => void }>) => {
	return (
		<button type="button">
			<PublishedWithChangesIcon
				titleAccess="Enabled, click to disable"
				className="text-green-500 hover:text-green-800"
				onClick={async () => {
					if (itemId) {
						await disable(itemId);
						onChanged();
					}
				}}
			/>
		</button>
	);
};

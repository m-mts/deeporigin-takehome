import UnpublishedIcon from "@mui/icons-material/Unpublished";
import enable from "./actions/enable";

export const DisabledButton = ({
	itemId,
	onChanged = () => {},
}: Partial<{ itemId: string; onChanged: () => void }>) => {
	return (
		<button type="button">
			<UnpublishedIcon
				titleAccess="Disabled, click to enable"
				className="text-red-500 hover:text-red-800"
				onClick={async () => {
					if (itemId) {
						await enable(itemId);
						onChanged();
					}
				}}
			/>
		</button>
	);
};

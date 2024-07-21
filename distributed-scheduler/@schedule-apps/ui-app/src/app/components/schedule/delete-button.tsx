"use client";
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import deleteTask from "@/app/actions/delete-schedule";
import { Alert } from "@/app/components/alert";

export const DeleteButton = ({
	itemId,
	description,
	onDeleted = () => {},
}: Partial<{ itemId: string; description: string; onDeleted: () => void }>) => {
	const [showAlert, setShowAlert] = useState(false);
	return (
		<div className="relative">
			<button type="button">
				<DeleteForeverIcon
					titleAccess="Enabled, click to disable"
					className="text-red-400 hover:text-red-700"
					onClick={() => {
						setShowAlert(true);
					}}
				/>
			</button>
			{showAlert && (
				<Alert
					type="warning"
					action={async () => {
						if (itemId) {
							await deleteTask(itemId);
							onDeleted();
						}
					}}
					cancel={() => setShowAlert(false)}
				>
					Are you sure you want to delete task "
					{description ?? "[with empty description]"}"?
				</Alert>
			)}
		</div>
	);
};

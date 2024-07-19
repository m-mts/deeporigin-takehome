"use client";
import WarningIcon from "@mui/icons-material/Warning";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

export type AlertType = "error" | "warning" | "info" | "success" | "neutral";
export function Alert({
  children,
  type,
  action,
  cancel,
}: {
  children: string[];
  type: AlertType;
  action: () => void;
  cancel: () => void;
}) {
  const classes = ["absolute bottom-0 right-0 w-[40rem]", "alert"];
  if (type === "error") classes.push("alert-error");
  if (type === "warning") classes.push("alert-warning");
  if (type === "info") classes.push("alert-info");
  if (type === "success") classes.push("alert-success");
  return (
    <div role="alert" className={classes.join(" ")}>
      {type === "error" && <NotificationImportantIcon />}
      {type === "warning" && <WarningIcon />}
      {type === "info" && <NewReleasesIcon />}
      {type === "success" && <ThumbUpAltIcon />}
      {type === "neutral" && <PriorityHighIcon />}
      <span>{children}</span>
      <div>
        <button className="btn btn-ghost btn-xs mx-3" onClick={cancel}>
          Cancel
        </button>
        <button className="btn btn-xs btn-error" onClick={action}>
          Ok
        </button>
      </div>
    </div>
  );
}

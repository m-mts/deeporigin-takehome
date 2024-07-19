import type { TaskRun } from "@/types/schedule";

export default async function TaskRunView({
	taskRuns,
}: { taskRuns: TaskRun[] }) {
	return (
		<div className="mt-10">
			<h1 className="text-3xl">History </h1>
			<div className="overflow-x-auto  bg-base-100">
				<table className="table table-zebra">
					<thead className="bg-base-200 text-base">
						<tr>
							<th>#</th>
							<th> Status </th>
							<th> Run At </th>
						</tr>
					</thead>
					<tbody>
						{taskRuns?.map((item, index) => (
							<tr key={`r-${Number(item.runAt)}`}>
								<td>{index + 1}</td>
								<td>{item.status}</td>
								<td>{item.runAt?.toString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

import { SubmitButton } from "@/app/components/submit-button";
import { Input } from "./input";
import { login } from "@/app/actions/authenticate";

export async function Form() {
	return (
		<form className="card-body" action={login}>
			<div className="form-control">
				<label className="label">
					<span className="label-text font-bold">\\ user name</span>
				</label>
				<Input />
			</div>
			<div className="form-control mt-6">
				<SubmitButton value="Go!" />
			</div>
		</form>
	);
}

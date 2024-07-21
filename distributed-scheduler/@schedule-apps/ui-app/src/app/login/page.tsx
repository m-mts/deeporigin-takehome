import { Form } from "@/app/components/login/form";

export default function LoginPage() {
	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content flex-col lg:flex-row-reverse ">
				<div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
					<Form data-testid="login-form" />
				</div>
			</div>
		</div>
	);
}

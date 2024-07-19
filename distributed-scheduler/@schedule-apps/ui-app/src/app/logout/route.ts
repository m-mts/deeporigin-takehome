import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { logout } from "@/app/actions/authenticate";

export async function GET() {
	logout();
	revalidatePath("/logout");
	redirect("/login");
}
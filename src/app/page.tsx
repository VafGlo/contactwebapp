import { redirect } from "next/navigation";

export default function HomeRedirect() {
  // Redirige automáticamente al usuario a /overview
  redirect("/overview");
}








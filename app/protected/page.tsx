import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  } else {
    const response = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (
      response.data?.linkedin_embedding !== "" ||
      response.data?.linkedin_embedding !== null
    ) {
      return redirect("/protected/waiting");
    } else {
      return redirect("/protected/onboarding");
    }
  }
}

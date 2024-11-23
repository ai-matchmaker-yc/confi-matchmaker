import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Index({ searchParams }: {
  searchParams: Promise<{ code: string | undefined }>;
}) {
  const { code } = await searchParams;

  if (code) {
    redirect(`/auth/callback?code=${code}`)
  } else {
    const supabase = await createClient()
    if (await supabase.auth.getUser()) {
      redirect("/protected")
    } else {
      redirect("/sign-in")
    }
  }

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1>You shouldnt see this 👀</h1>
      </main>
    </>
  );
}

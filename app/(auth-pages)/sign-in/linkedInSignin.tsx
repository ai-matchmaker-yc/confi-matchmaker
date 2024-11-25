"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Linkedin } from "lucide-react";

export default function LinkedInSignin() {
  const defaultUrl = "https://confi-matchmaker.vercel.app";


  const supabase = createClient();
  return (
    <Button
      className="w-full bg-blue-600 text-white hover:bg-blue-700 gap-3"
      onClick={() =>
        supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: defaultUrl + "/auth/callback",
            scopes: "openid,profile,email",
          },
        })
      }
    >
      <Linkedin size="20" />
      Log in with LinkedIn
    </Button>
  );
}

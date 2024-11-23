"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function LinkedInSignin() {
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";


  const supabase = createClient();
  return (
    <Button
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
      Log in with LinkedIn
    </Button>
  );
}
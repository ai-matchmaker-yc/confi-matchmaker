"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function LinkedInSignin() {
  const supabase = createClient();
  return (
    <Button
      onClick={() =>
        supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: "/auth/callback",
            scopes: "openid,profile,email",
          },
        })
      }
    >
      Log in with LinkedIn
    </Button>
  );
}
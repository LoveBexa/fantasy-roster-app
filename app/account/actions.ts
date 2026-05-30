"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function deleteAccountAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { error } = await supabase.rpc("delete_user")

  if (error) {
    return {
      error:
        "Account deletion is not available yet. Email support@leveluproster.com and we will remove your account.",
    }
  }

  await supabase.auth.signOut()
  redirect("/")
}

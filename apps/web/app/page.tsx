import { redirect } from "next/navigation"

export default function Home() {
  // ルートパスにアクセスしたときにダッシュボードページにリダイレクト
  redirect("/dashboard")
}

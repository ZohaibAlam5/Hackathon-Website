import { redirect } from "next/navigation";

export default function HdemoPage() {
  // Old demo checkout flow — superseded by the new /checkout page.
  redirect("/checkout");
}

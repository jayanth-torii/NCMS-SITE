import { redirect } from "next/navigation";

import { slugifyDept } from "@/lib/departments";

// Every department now has its own route: /department/<slug> (NCET style).
// Legacy /department?programme=X links redirect to the matching slug route.
export default async function DepartmentIndex({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string }>;
}) {
  const { programme } = await searchParams;
  if (programme) {
    const slug = slugifyDept(programme);
    if (slug) redirect(`/department/${slug}`);
  }
  redirect("/department/science");
}

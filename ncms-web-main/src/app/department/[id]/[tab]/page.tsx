import { notFound } from "next/navigation";

import DepartmentShell from "@/components/Departments/DepartmentShell";

import departmentBannersData from "@/data-export/department-banners/data.json";
import {
  DEPARTMENT_TAB_IDS,
  deptProgrammeToBannerKey,
  deptSlugToProgramme,
  deptTabLabel,
  formatDeptTitle,
  isValidDeptTab,
  slugifyDept,
} from "@/lib/departments";

const banners: any = (departmentBannersData as any).data || departmentBannersData;

export function generateStaticParams() {
  return Object.values(banners)
    .map((b: any) => slugifyDept(b?.title || ""))
    .filter((slug) => !!slug)
    .filter((slug, i, arr) => arr.indexOf(slug) === i)
    .flatMap((id) => DEPARTMENT_TAB_IDS.map((tab) => ({ id, tab })));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; tab: string }> }) {
  const { id, tab } = await params;
  const programme = deptSlugToProgramme(id);
  const title = formatDeptTitle(programme);
  const tabLabel = deptTabLabel(isValidDeptTab(tab) ? tab : "about");
  return {
    title: `${tabLabel} — ${title} | Nagarjuna College of Management Studies`,
    description: `${tabLabel} details for ${title} at NCMS.`,
  };
}

export default async function DepartmentTabPage({ params }: { params: Promise<{ id: string; tab: string }> }) {
  const { id, tab } = await params;
  const programme = deptSlugToProgramme(id);

  if (slugifyDept(programme) !== id) notFound();
  if (!deptProgrammeToBannerKey(programme)) notFound();

  return <DepartmentShell id={id} programme={programme} tab={isValidDeptTab(tab) ? tab : "about"} />;
}

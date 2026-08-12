import { notFound } from "next/navigation";

import DepartmentShell from "@/components/Departments/DepartmentShell";

import departmentBannersData from "@/data-export/department-banners/data.json";
import {
  deptProgrammeToBannerKey,
  deptSlugToProgramme,
  formatDeptTitle,
  slugifyDept,
} from "@/lib/departments";

const banners: any = (departmentBannersData as any).data || departmentBannersData;

export function generateStaticParams() {
  return Object.values(banners)
    .map((b: any) => slugifyDept(b?.title || ""))
    .filter((slug) => !!slug)
    .filter((slug, i, arr) => arr.indexOf(slug) === i)
    .map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const programme = deptSlugToProgramme(id);
  const title = formatDeptTitle(programme);
  return {
    title: `${title} | Nagarjuna College of Management Studies`,
    description: `Explore ${title} at NCMS — curriculum, faculty, HOD's message, programme outcomes and syllabus.`,
  };
}

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const programme = deptSlugToProgramme(id);

  // Only serve canonical slugs ("Masters In Business Administration" -> masters-in-business-administration)
  if (slugifyDept(programme) !== id) notFound();
  // Truly unknown departments 404 instead of rendering a generic page
  if (!deptProgrammeToBannerKey(programme)) notFound();

  return <DepartmentShell id={id} programme={programme} tab="about" />;
}

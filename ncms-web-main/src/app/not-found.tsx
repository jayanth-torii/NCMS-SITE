import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex  flex-col items-center justify-center p-6 text-center">
      <Image
        src="/images/not-found-img.png"
        alt="Not Found Image"
        width={400}
        height={300}
        className="mx-auto"
        priority
      />
      
      <p className="mt-2 text-[#0E2455] font-semibold">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md border bg-[#0E2455] px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 hover:text-[#0E2455] focus:outline-none focus:ring active:text-[#0E2455]"
      >
        Go back home
      </Link>
    </main>
  );
}
import type { Metadata } from "next";
import { AdminClientLayout } from "@/components/admin/AdminClientLayout";

export const metadata: Metadata = {
  title: "Kusumika Atelier Operations Console",
  description: "Restricted administrative console for Kusumika luxury home textiles.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}

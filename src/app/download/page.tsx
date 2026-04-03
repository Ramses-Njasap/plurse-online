// src/app/download/page.tsx
import Download from "@/components/download/download";
import Footer from "@/components/Footer";

export const metadata = {
  title:       "Download Plurse",
  description: "Download Plurse free for Windows, macOS and Linux.",
};

export default function Page() {
  return (
    <>
      <Download />
      <Footer />
    </>
  );
}
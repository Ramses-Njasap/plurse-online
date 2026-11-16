import Navbar from "@/components/Navbar";
import GridBackground from "@/components/Background";
import { ToastProvider } from "@/components/ui";
import { Analytics } from "@vercel/analytics/next"

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <div className="min-h-full flex flex-col bg-[#FAFAF9]">
                <GridBackground />
                <Navbar />

                <main className="relative z-10 flex-1 pt-[68px]">
                    {children}
                    <Analytics />
                </main>
            </div>
        </ToastProvider>
    );
}
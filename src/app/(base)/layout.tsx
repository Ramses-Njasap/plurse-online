import Navbar from "@/components/Navbar";
import GridBackground from "@/components/Background";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-full flex flex-col bg-[#FAFAF9]">
            <GridBackground />
            <Navbar />

            <main className="relative z-10 flex-1 pt-[68px]">
                {children}
            </main>
        </div>
    );
}
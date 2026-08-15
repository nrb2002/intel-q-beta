import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileSidebar />

      <div className="flex">
        <Sidebar />

        <main
          className="
          flex-1
          p-6
        "
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

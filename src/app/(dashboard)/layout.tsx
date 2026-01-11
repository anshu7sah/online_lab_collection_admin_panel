// "use client";


// import Sidebar from "@/components/layout/Sidebar";
// import Topbar from "@/components/layout/Topbar";
// import { useCurrent } from "@/hooks/useCurrent";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { data: user, isLoading } = useCurrent();

//   if (isLoading) return null;

//   if (!user || user.role !== "ADMIN") {
//     return <div className="p-6">Unauthorized</div>;
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <aside className="w-64 bg-gray-900 text-white">
//         <Sidebar />
//       </aside>

//       <div className="flex-1 flex flex-col">
//         <Topbar />

//         <main className="flex-1 p-6">{children}</main>
//       </div>
//     </div>
//   );
// }

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProtectedAdmin from "@/components/ProtectedAdmin";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedAdmin>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedAdmin>
  );
}

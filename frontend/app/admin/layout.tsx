import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[1fr,4fr]">
      <aside className="hidden md:block h-screen sticky top-0">
        <div className="h-full bg-main overflow-y-auto border-second border-r-2">
          <AdminSidebar />
        </div>
      </aside>
      {/* page.tsx */}
      <div>{children}</div>
    </div>
  );
};
export default AdminLayout;

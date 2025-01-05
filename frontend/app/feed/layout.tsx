export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 mx-auto max-w-7xl">
      {/* Sidebar ฝั่งซ้าย */}
      <div className="col-span-3">{/* <Sidebar /> */}</div>

      {/* Main content ตรงกลาง */}
      <main className="col-span-6">
        {children} {/* ตรงนี้จะแสดงเนื้อหาจาก page.tsx */}
      </main>

      {/* Online users ฝั่งขวา */}
      <div className="col-span-3">{/* <OnlineUsers /> */}</div>
    </div>
  );
}

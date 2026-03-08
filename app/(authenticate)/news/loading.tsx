export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-24 rounded-2xl bg-white" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[430px] rounded-2xl bg-white lg:col-span-2" />
          <div className="h-[430px] rounded-2xl bg-white" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="h-6 w-28 rounded bg-slate-200" />
          <div className="h-10 w-28 rounded-lg bg-slate-200" />
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="h-56 rounded-lg border border-slate-200 bg-white p-6">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-4 h-10 w-2/3 rounded bg-slate-200" />
            <div className="mt-4 h-5 w-full rounded bg-slate-100" />
            <div className="mt-2 h-5 w-3/4 rounded bg-slate-100" />
          </div>
          <div className="h-56 rounded-lg bg-slate-950" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 rounded-lg border border-slate-200 bg-white p-5">
              <div className="h-8 w-16 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-28 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

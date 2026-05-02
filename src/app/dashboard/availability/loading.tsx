export default function AvailabilityLoading() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="h-10 w-20 rounded-lg bg-slate-200" />
          <div className="h-6 w-28 rounded bg-slate-200" />
        </div>
      </nav>
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-4 h-10 w-2/3 rounded bg-slate-200" />
          <div className="mt-6 grid gap-2 sm:grid-cols-7">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="h-12 rounded-lg bg-slate-100" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-12 rounded-lg bg-slate-100" />
            <div className="h-12 rounded-lg bg-slate-100" />
          </div>
        </div>
      </section>
    </main>
  )
}

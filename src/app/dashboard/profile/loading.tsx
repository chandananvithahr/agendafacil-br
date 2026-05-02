export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="h-10 w-20 rounded-lg bg-slate-200" />
          <div className="h-6 w-28 rounded bg-slate-200" />
        </div>
      </nav>
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-10 w-3/4 rounded bg-slate-200" />
          <div className="mt-6 grid gap-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-12 rounded-lg bg-slate-100" />
            ))}
          </div>
        </section>
        <aside className="h-64 rounded-lg border border-slate-200 bg-white p-6" />
      </div>
    </main>
  )
}

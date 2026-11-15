export default function Loading() {
  return (
    <div className="animate-pulse space-y-5 pt-4">
      <div className="h-4 w-64 rounded bg-panel-2" />
      <div className="h-14 w-96 max-w-full rounded bg-panel-2" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel h-32" />)}
      </div>
      <div className="panel h-80" />
    </div>
  );
}

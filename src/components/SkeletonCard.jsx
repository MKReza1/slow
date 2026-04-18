export default function SkeletonCard() {
  return (
    <div className="glass animate-pulse rounded-2xl p-4">
      <div className="mb-4 h-56 rounded-xl bg-slate-700/30" />
      <div className="mb-2 h-4 w-2/3 rounded bg-slate-700/30" />
      <div className="h-4 w-1/3 rounded bg-slate-700/30" />
    </div>
  );
}

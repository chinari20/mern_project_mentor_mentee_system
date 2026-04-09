export function StatCard({ label, value, helper }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </div>
  );
}

export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

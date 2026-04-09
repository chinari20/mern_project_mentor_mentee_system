export function Input({ label, ...props }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <input className="input" {...props} />
    </label>
  );
}

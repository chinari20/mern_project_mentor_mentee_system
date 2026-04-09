export function Textarea({ label, ...props }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <textarea className="input min-h-28 resize-none" {...props} />
    </label>
  );
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-extrabold text-slate-950">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

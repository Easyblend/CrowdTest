export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mt-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h2 className="text-3xl font-semibold">{title}</h2>
      {subtitle && <p className="text-slate-600 dark:text-slate-300 mt-2">{subtitle}</p>}
    </div>
  );
}

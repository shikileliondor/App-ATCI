export default function StatsCard({ title, value, icon, hint }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a56a0]/10 text-xl text-[#1a56a0]">
                    {icon}
                </span>
            </div>
            {hint ? <p className="mt-3 text-xs text-gray-500">{hint}</p> : null}
        </div>
    );
}

function getDaysRange(start, end) {
    if (!start || !end) return [];

    const begin = new Date(`${start}T00:00:00`);
    const finish = new Date(`${end}T00:00:00`);

    if (Number.isNaN(begin.getTime()) || Number.isNaN(finish.getTime()) || finish < begin) {
        return [];
    }

    const list = [];
    const current = new Date(begin);

    while (current <= finish) {
        list.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return list;
}

export default function Timeline({ startDate, endDate }) {
    const days = getDaysRange(startDate, endDate);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Timeline du programme</h3>
            {days.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">Aucune période valide pour générer la timeline.</p>
            ) : (
                <div className="mt-4 space-y-3">
                    {days.map((day, index) => (
                        <div key={day.toISOString()} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a56a0]/10 text-xs font-semibold text-[#1a56a0]">
                                {index + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Jour {index + 1}</p>
                                <p className="text-xs text-gray-600">{day.toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

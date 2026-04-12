export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, errors = {} }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Date début</span>
                <input
                    type="date"
                    value={startDate}
                    onChange={(event) => onStartChange(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.date_debut ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.date_debut ? <p className="text-xs text-red-600">{errors.date_debut}</p> : null}
            </label>

            <label className="space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Date fin</span>
                <input
                    type="date"
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(event) => onEndChange(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.date_fin ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.date_fin ? <p className="text-xs text-red-600">{errors.date_fin}</p> : null}
            </label>
        </div>
    );
}

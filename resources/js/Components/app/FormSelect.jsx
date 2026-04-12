export default function FormSelect({ label, name, value, onChange, options, required = false, error, className = '' }) {
    return (
        <label className={`block space-y-1.5 ${className}`}>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-[#1a56a0]/20 ${error ? 'border-red-300' : 'border-gray-200'}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </label>
    );
}

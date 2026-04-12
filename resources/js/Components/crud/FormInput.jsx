export default function FormInput({ label, error, className = '', ...props }) {
    return (
        <label className={`block space-y-1.5 ${className}`}>
            {label ? <span className="text-sm font-medium text-gray-700">{label}</span> : null}
            <input
                {...props}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#1a56a0] focus:ring-2 focus:ring-[#1a56a0]/20"
            />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </label>
    );
}

export default function FormInput({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    required = false,
    error,
    className = '',
    ...props
}) {
    return (
        <label className={`block space-y-1.5 ${className}`}>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-[#1a56a0]/20 ${error ? 'border-red-300' : 'border-gray-200'}`}
                {...props}
            />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </label>
    );
}

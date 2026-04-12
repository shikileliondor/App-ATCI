export default function Select({ options = [], className = '', ...props }) {
    return (
        <select className={`h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-[#1a56a0] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 ${className}`} {...props}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
}

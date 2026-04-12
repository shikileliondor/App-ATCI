export default function Badge({ variant = 'default', className = '', children }) {
    const variants = {
        default: 'bg-blue-100 text-blue-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        outline: 'border border-gray-200 bg-white text-gray-700',
    };

    return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>{children}</span>;
}

export default function Button({ variant = 'default', size = 'default', className = '', type = 'button', ...props }) {
    const variants = {
        default: 'bg-[#1a56a0] text-white hover:bg-[#154782]',
        secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
        ghost: 'text-gray-600 hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        icon: 'h-10 w-10',
    };

    return <button type={type} className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/25 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

export default function Input({ className = '', ...props }) {
    return <input className={`h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#1a56a0] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 ${className}`} {...props} />;
}

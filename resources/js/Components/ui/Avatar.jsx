export function Avatar({ children, className = '' }) {
    return <div className={`inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#1a56a0]/10 ${className}`}>{children}</div>;
}

export function AvatarFallback({ children, className = '' }) {
    return <span className={`text-sm font-semibold text-[#1a56a0] ${className}`}>{children}</span>;
}

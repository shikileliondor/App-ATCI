export default function PageContainer({ children, className = '' }) {
    return <div className={`space-y-6 ${className}`.trim()}>{children}</div>;
}

export default function StatusBadge({ status }) {
    const normalized = (status ?? '').toLowerCase();
    const isActive = normalized === 'actif';

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
            {isActive ? 'Actif' : 'Terminé'}
        </span>
    );
}

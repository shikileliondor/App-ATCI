export default function StatusBadge({ statut = 'inactif' }) {
    const active = statut === 'actif';

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
            {active ? 'Actif' : 'Inactif'}
        </span>
    );
}

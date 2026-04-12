import Button from '@/Components/ui/Button';

function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR');
}

export default function PresenceTable({ presences, sortDirection, onSort, onEdit, onDelete }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <button type="button" className="inline-flex items-center gap-2" onClick={onSort}>
                                    Date {sortDirection === 'asc' ? '↑' : '↓'}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre participants</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {presences.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-500">Aucune présence enregistrée.</td>
                            </tr>
                        ) : presences.map((presence) => (
                            <tr key={presence.id} className="hover:bg-gray-50/70">
                                <td className="px-4 py-3 text-gray-700">{formatDate(presence.date)}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{presence.nombre_participants}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => onEdit(presence)}>Modifier</Button>
                                        <Button variant="destructive" size="sm" onClick={() => onDelete(presence)}>Supprimer</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

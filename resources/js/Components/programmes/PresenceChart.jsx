function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export default function PresenceChart({ presences }) {
    if (!presences?.length) {
        return <p className="text-sm text-gray-500">Aucune présence pour afficher un graphique.</p>;
    }

    const max = Math.max(...presences.map((item) => Number(item.nombre_participants ?? 0)), 1);

    return (
        <div className="space-y-3">
            {presences.map((item) => {
                const value = Number(item.nombre_participants ?? 0);
                const width = `${Math.max((value / max) * 100, 2)}%`;

                return (
                    <div key={item.id}>
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(item.date)}</span>
                            <span>{value} participants</span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-100">
                            <div className="h-3 rounded-full bg-[#1a56a0]" style={{ width }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

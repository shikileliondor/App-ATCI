import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from '@/Components/Icons';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import DataTable from '@/Components/programmes/DataTable';
import ConfirmDialog from '@/Components/programmes/ConfirmDialog';
import StatusBadge from '@/Components/programmes/StatusBadge';

const PAGE_SIZE = 8;

function diffInDays(start, end) {
    const first = new Date(`${start}T00:00:00`);
    const second = new Date(`${end}T00:00:00`);
    const diff = Math.round((second - first) / (1000 * 60 * 60 * 24));
    return Number.isNaN(diff) ? 0 : diff + 1;
}

function isOngoing(start, end) {
    const today = new Date();
    const now = new Date(`${today.toISOString().slice(0, 10)}T00:00:00`);
    const begin = new Date(`${start}T00:00:00`);
    const finish = new Date(`${end}T00:00:00`);
    return now >= begin && now <= finish;
}

export default function Index() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadEvents = async () => {
        setLoading(true);
        const response = await window.axios.get('/api/programmes');
        const payload = response.data?.data;
        setItems(Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
        setLoading(false);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const filtered = useMemo(() => {
        const filteredItems = items.filter((programme) => {
            const inQuery = !query || [programme.nom, programme.lieu, programme.description]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(query.toLowerCase()));
            const inStatus = !statusFilter || programme.statut === statusFilter;
            return inQuery && inStatus;
        });

        return filteredItems.sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));
    }, [items, query, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        setPage((currentPage) => Math.min(currentPage, totalPages));
    }, [totalPages]);

    const remove = async () => {
        if (!deleteTarget) return;
        await window.axios.delete(`/api/programmes/${deleteTarget.id}`);
        setDeleteTarget(null);
        loadEvents();
    };

    const columns = [
        {
            key: 'nom',
            label: 'Événement',
            render: (row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.nom}</div>
                    {isOngoing(row.date_debut, row.date_fin) ? <p className="text-xs text-emerald-600">Événement en cours</p> : null}
                </div>
            ),
        },
        { key: 'type', label: 'Type', render: (row) => row.type || '-' },
        { key: 'date_debut', label: 'Début', render: (row) => new Date(row.date_debut).toLocaleDateString('fr-FR') },
        { key: 'date_fin', label: 'Fin', render: (row) => new Date(row.date_fin).toLocaleDateString('fr-FR') },
        { key: 'heure', label: 'Heure', render: (row) => row.heure || '-' },
        { key: 'lieu', label: 'Lieu' },
        { key: 'statut', label: 'Statut', render: (row) => <StatusBadge status={row.statut} /> },
        { key: 'duree', label: 'Durée', render: (row) => `${diffInDays(row.date_debut, row.date_fin)} jours` },
    ];

    return (
        <MainLayout title="Événements de prière" subtitle="Gestion moderne des événements (hors cultes)" actionLabel="Créer un événement" onAction={() => router.visit('/programmes/create')}>
            <Head title="Événements de prière" />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 flex-col gap-2 md:flex-row">
                            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un événement..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                <option value="">Tous les statuts</option>
                                <option value="actif">Actif</option>
                                <option value="termine">Terminé</option>
                            </select>
                        </div>
                        <Link href="/programmes/create"><Button><Plus size={16} /> Créer un événement</Button></Link>
                    </div>

                    {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                        <>
                            <DataTable
                                columns={columns}
                                data={paginated}
                                emptyMessage="Aucun événement pour le moment"
                                renderActions={(row) => (
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/programmes/${row.id}`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Eye size={14} /></Link>
                                        <Link href={`/programmes/${row.id}/edit`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Pencil size={14} /></Link>
                                        <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-lg border border-red-200 p-2 text-red-600"><Trash2 size={14} /></button>
                                    </div>
                                )}
                            />
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                <p>{filtered.length} événement(s)</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Précédent</Button>
                                    <span>Page {page}/{totalPages}</span>
                                    <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Suivant</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <ConfirmDialog
                    open={Boolean(deleteTarget)}
                    title="Supprimer ce programme ?"
                    description={deleteTarget ? `Le programme "${deleteTarget.nom}" sera supprimé définitivement.` : ''}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={remove}
                />
            </PageContainer>
        </MainLayout>
    );
}

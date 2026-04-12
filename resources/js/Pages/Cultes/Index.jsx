import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Eye, Pencil, Plus, Trash2 } from '@/Components/Icons';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import DataTable from '@/Components/crud/DataTable';
import ConfirmDialog from '@/Components/crud/ConfirmDialog';

export default function Index() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadCultes = async () => {
        setLoading(true);
        const response = await window.axios.get('/api/cultes');
        setItems(Array.isArray(response.data?.data?.data) ? response.data.data.data : []);
        setLoading(false);
    };

    useEffect(() => {
        loadCultes();
    }, []);

    const filtered = useMemo(() => items.filter((culte) => {
        const matchQuery = !query || culte.titre?.toLowerCase().includes(query.toLowerCase()) || culte.theme?.toLowerCase().includes(query.toLowerCase()) || culte.pasteur?.toLowerCase().includes(query.toLowerCase());
        const matchDate = !dateFilter || culte.date_culte === dateFilter;
        return matchQuery && matchDate;
    }), [items, query, dateFilter]);

    const remove = async () => {
        if (!deleteTarget) return;
        await window.axios.delete(`/api/cultes/${deleteTarget.id}`);
        setDeleteTarget(null);
        loadCultes();
    };

    const columns = [
        { key: 'titre', label: 'Nom du culte', render: (row) => <div className="flex items-center gap-2 font-medium text-gray-900"><CalendarDays size={16} className="text-[#1a56a0]" />{row.titre}</div> },
        { key: 'theme', label: 'Type', render: (row) => <span className="rounded-full bg-[#1a56a0]/10 px-2 py-1 text-xs font-medium text-[#1a56a0]">{row.theme ?? 'Autre'}</span> },
        { key: 'date_culte', label: 'Date', render: (row) => new Date(row.date_culte).toLocaleDateString('fr-FR') },
        { key: 'heure', label: 'Heure', render: (row) => row.heure ?? '-' },
        { key: 'lieu', label: 'Lieu', render: (row) => row.lieu ?? '-' },
        { key: 'pasteur', label: 'Responsable', render: (row) => row.pasteur ?? '-' },
    ];

    return (
        <MainLayout title="Cultes" subtitle="Planifiez les activités spirituelles" actionLabel="Ajouter culte" onAction={() => router.visit('/cultes/create')}>
            <Head title="Cultes" />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 gap-2">
                            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un culte..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                        </div>
                        <Link href="/cultes/create"><Button><Plus size={16} /> Ajouter culte</Button></Link>
                    </div>

                    {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                        <DataTable
                            columns={columns}
                            data={filtered}
                            emptyTitle="Aucun culte"
                            emptyDescription="Ajoutez un culte pour démarrer la planification."
                            renderActions={(row) => (
                                <div className="flex justify-end gap-2">
                                    <Link href={`/cultes/${row.id}`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Eye size={14} /></Link>
                                    <Link href={`/cultes/${row.id}/edit`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Pencil size={14} /></Link>
                                    <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-lg border border-red-200 p-2 text-red-600"><Trash2 size={14} /></button>
                                </div>
                            )}
                        />
                    )}
                </div>

                <ConfirmDialog
                    open={Boolean(deleteTarget)}
                    title="Supprimer ce culte ?"
                    description={deleteTarget ? `Le culte "${deleteTarget.titre}" sera supprimé définitivement.` : ''}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={remove}
                />
            </PageContainer>
        </MainLayout>
    );
}

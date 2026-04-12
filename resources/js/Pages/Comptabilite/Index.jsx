import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import DataTable from '@/Components/app/DataTable';
import FormInput from '@/Components/app/FormInput';
import FormSelect from '@/Components/app/FormSelect';
import ConfirmDialog from '@/Components/app/ConfirmDialog';

const categoryLabels = { dime: 'Dîme', offrande: 'Offrande', don: 'Don', autre: 'Dépense / Autre' };

export default function ComptabiliteIndex() {
    const [transactions, setTransactions] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: 'all', date: '' });
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/comptabilites', { params: { page } });
            const payload = data?.data;
            setTransactions(payload?.data ?? []);
            setMeta(payload?.meta ? payload.meta : { current_page: payload.current_page, last_page: payload.last_page, total: payload.total });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(1);
    }, []);

    const filtered = useMemo(() => {
        return transactions.filter((item) => {
            const matchesType = filters.type === 'all' ? true : (filters.type === 'entree' ? item.type !== 'autre' : item.type === 'autre');
            const matchesDate = filters.date ? item.date_operation === filters.date : true;
            return matchesType && matchesDate;
        });
    }, [transactions, filters]);

    const totals = useMemo(() => {
        return filtered.reduce((acc, item) => {
            const amount = Number(item.montant || 0);
            if (item.type === 'autre') {
                acc.sorties += amount;
            } else {
                acc.entrees += amount;
            }
            return acc;
        }, { entrees: 0, sorties: 0 });
    }, [filtered]);

    const columns = [
        { key: 'type', label: 'Type', render: (row) => row.type === 'autre' ? <Badge variant="danger">Sortie</Badge> : <Badge variant="success">Entrée</Badge> },
        { key: 'categorie', label: 'Catégorie', render: (row) => categoryLabels[row.type] ?? row.type },
        { key: 'montant', label: 'Montant', render: (row) => `${Number(row.montant).toLocaleString()} FCFA` },
        { key: 'date_operation', label: 'Date' },
        { key: 'description', label: 'Description' },
    ];

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await axios.delete(`/api/comptabilites/${deleteTarget.id}`);
        setDeleteTarget(null);
        load(meta.current_page);
    };

    return (
        <MainLayout title="Comptabilité" subtitle="Suivi des entrées et sorties" actionLabel="Ajouter transaction" onAction={() => router.visit('/comptabilite/create')}>
            <Head title="Comptabilité" />
            <PageContainer>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Total entrées</p><p className="mt-2 text-2xl font-semibold text-emerald-600">{totals.entrees.toLocaleString()} FCFA</p></div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Total sorties</p><p className="mt-2 text-2xl font-semibold text-red-600">{totals.sorties.toLocaleString()} FCFA</p></div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Solde</p><p className="mt-2 text-2xl font-semibold text-[#1a56a0]">{(totals.entrees - totals.sorties).toLocaleString()} FCFA</p></div>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        <FormSelect
                            label="Filtre type"
                            name="type"
                            value={filters.type}
                            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                            options={[{ value: 'all', label: 'Tous' }, { value: 'entree', label: 'Entrées' }, { value: 'sortie', label: 'Sorties' }]}
                        />
                        <FormInput label="Date" type="date" name="date" value={filters.date} onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))} />
                        <div className="flex items-end"><Link href="/comptabilite/create"><Button>Ajouter transaction</Button></Link></div>
                    </div>

                    {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                        <DataTable
                            columns={columns}
                            data={filtered}
                            emptyTitle="Aucune transaction"
                            emptyDescription="Ajoutez une première transaction comptable."
                            actions={(row) => (
                                <div className="flex justify-end gap-2">
                                    <Link href={`/comptabilite/${row.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs">Voir</Link>
                                    <Link href={`/comptabilite/${row.id}/edit`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs">Modifier</Link>
                                    <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600">Supprimer</button>
                                </div>
                            )}
                        />
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Total: {meta.total ?? transactions.length}</span>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => load(meta.current_page - 1)} disabled={meta.current_page <= 1}>Précédent</Button>
                            <Button variant="secondary" size="sm" onClick={() => load(meta.current_page + 1)} disabled={meta.current_page >= meta.last_page}>Suivant</Button>
                        </div>
                    </div>
                </div>

                <ConfirmDialog
                    open={Boolean(deleteTarget)}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    title="Supprimer cette transaction ?"
                    description="Cette suppression est définitive."
                />
            </PageContainer>
        </MainLayout>
    );
}

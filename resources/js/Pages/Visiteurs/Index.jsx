import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import DataTable from '@/Components/app/DataTable';
import FormInput from '@/Components/app/FormInput';
import ConfirmDialog from '@/Components/app/ConfirmDialog';

export default function VisiteursIndex() {
    const [visiteurs, setVisiteurs] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/visiteurs', { params: { page } });
            const payload = data?.data;
            setVisiteurs(payload?.data ?? []);
            setMeta(payload?.meta ? payload.meta : { current_page: payload.current_page, last_page: payload.last_page, total: payload.total });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(1);
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return visiteurs;

        return visiteurs.filter((item) => [item.nom, item.prenom, item.telephone, item.commentaire].filter(Boolean).join(' ').toLowerCase().includes(term));
    }, [visiteurs, search]);

    const columns = [
        { key: 'nom', label: 'Nom', render: (row) => <span className="font-medium text-gray-900">{row.nom}</span> },
        { key: 'prenom', label: 'Prénom' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'date_visite', label: 'Date de visite' },
        { key: 'motif_visite', label: 'Invité par / Motif', render: (row) => row.motif_visite || '-' },
    ];

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/visiteurs/${deleteTarget.id}`);
            setDeleteTarget(null);
            load(meta.current_page);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <MainLayout title="Visiteurs" subtitle="Suivi des visiteurs de l'église" actionLabel="Ajouter un visiteur" onAction={() => router.visit('/visiteurs/create')}>
            <Head title="Visiteurs" />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <FormInput label="Recherche" name="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, prénom, téléphone..." className="sm:max-w-md" />
                        <Link href="/visiteurs/create"><Button>Ajouter un visiteur</Button></Link>
                    </div>
                    {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                        <DataTable
                            columns={columns}
                            data={filtered}
                            emptyTitle="Aucun visiteur"
                            emptyDescription="Commencez par ajouter un nouveau visiteur."
                            actions={(row) => (
                                <div className="flex justify-end gap-2">
                                    <Link href={`/visiteurs/${row.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs">Voir</Link>
                                    <Link href={`/visiteurs/${row.id}/edit`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs">Modifier</Link>
                                    <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600">Supprimer</button>
                                </div>
                            )}
                        />
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Total: {meta.total ?? visiteurs.length}</span>
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
                    loading={deleting}
                    title="Supprimer ce visiteur ?"
                    description={deleteTarget ? `Le profil de ${deleteTarget.nom} ${deleteTarget.prenom} sera définitivement supprimé.` : ''}
                />
            </PageContainer>
        </MainLayout>
    );
}

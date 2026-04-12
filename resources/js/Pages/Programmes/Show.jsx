import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import StatusBadge from '@/Components/programmes/StatusBadge';
import Timeline from '@/Components/programmes/Timeline';
import StatsCard from '@/Components/programmes/StatsCard';
import PresenceChart from '@/Components/programmes/PresenceChart';
import PresenceTable from '@/Components/programmes/PresenceTable';
import PresenceForm from '@/Components/programmes/PresenceForm';
import ConfirmDialog from '@/Components/programmes/ConfirmDialog';

function durationInDays(start, end) {
    const begin = new Date(`${start}T00:00:00`);
    const finish = new Date(`${end}T00:00:00`);
    return Math.round((finish - begin) / (1000 * 60 * 60 * 24)) + 1;
}

export default function Show() {
    const { url } = usePage();
    const id = url.split('/')[2];

    const [programme, setProgramme] = useState(null);
    const [presences, setPresences] = useState([]);
    const [stats, setStats] = useState({ total: 0, moyenne: 0, max: 0, min: 0, jours: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [openForm, setOpenForm] = useState(false);
    const [editingPresence, setEditingPresence] = useState(null);
    const [presenceToDelete, setPresenceToDelete] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadDashboard = async () => {
        try {
            const response = await window.axios.get(`/api/programmes/${id}`);
            const payload = response.data?.data ?? {};

            setProgramme(payload.programme ?? null);
            setPresences(payload.presences ?? []);
            setStats(payload.stats ?? { total: 0, moyenne: 0, max: 0, min: 0, jours: 0 });
            setError('');
        } catch {
            setError('Impossible de charger les statistiques du programme.');
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [id]);

    const duration = useMemo(() => {
        if (!programme) return 0;
        return durationInDays(programme.date_debut, programme.date_fin);
    }, [programme]);

    const trend = useMemo(() => {
        if (presences.length < 2) return null;

        const first = Number(presences[0].nombre_participants ?? 0);
        const last = Number(presences[presences.length - 1].nombre_participants ?? 0);

        if (last > first) return 'up';
        if (last < first) return 'down';
        return 'stable';
    }, [presences]);

    const sortedPresences = useMemo(() => {
        const items = [...presences];
        items.sort((a, b) => {
            if (sortDirection === 'asc') return new Date(a.date) - new Date(b.date);
            return new Date(b.date) - new Date(a.date);
        });
        return items;
    }, [presences, sortDirection]);

    const handleSubmitPresence = async (formData) => {
        try {
            setLoading(true);

            if (editingPresence) {
                await window.axios.put(`/api/programmes/${programme.id}/presences/${editingPresence.id}`, formData);
                showToast('Présence mise à jour avec succès.');
            } else {
                await window.axios.post(`/api/programmes/${programme.id}/presences`, formData);
                showToast('Présence ajoutée avec succès.');
            }

            setOpenForm(false);
            setEditingPresence(null);
            await loadDashboard();
        } catch {
            showToast('Erreur lors de l’enregistrement de la présence.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePresence = async () => {
        if (!presenceToDelete) return;

        try {
            setLoading(true);
            await window.axios.delete(`/api/programmes/${programme.id}/presences/${presenceToDelete.id}`);
            setPresenceToDelete(null);
            showToast('Présence supprimée avec succès.');
            await loadDashboard();
        } catch {
            showToast('Erreur lors de la suppression.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Détails du programme" subtitle="Dashboard analytique de participation">
            <Head title="Détails programme" />
            <PageContainer>
                {toast ? (
                    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {toast.message}
                    </div>
                ) : null}

                {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

                {!programme ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            <StatsCard title="Total participants" value={stats.total} icon="👥" />
                            <StatsCard title="Moyenne / jour" value={stats.moyenne} icon="📊" />
                            <StatsCard title="Jour max" value={stats.max} icon="📈" />
                            <StatsCard title="Jour min" value={stats.min} icon="📉" />
                            <StatsCard title="Nombre de jours" value={stats.jours} icon="🗓️" />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-2xl font-semibold text-gray-900">{programme.nom}</h2>
                                        <StatusBadge status={programme.statut} />
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                                        {trend === 'up' ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">📈 Participation en hausse</span> : null}
                                        {trend === 'down' ? <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">📉 Participation en baisse</span> : null}
                                        <span className={`rounded-full px-3 py-1 ${programme.statut === 'termine' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {programme.statut === 'termine' ? 'Programme terminé' : 'Programme actif'}
                                        </span>
                                    </div>

                                    <p className="mt-5 text-xs uppercase text-gray-500">Période</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {new Date(programme.date_debut).toLocaleDateString('fr-FR')} → {new Date(programme.date_fin).toLocaleDateString('fr-FR')}
                                    </p>

                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs uppercase text-gray-500">Durée</p>
                                            <p className="text-sm font-medium text-gray-800">{duration} jours</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500">Lieu</p>
                                            <p className="text-sm font-medium text-gray-800">{programme.lieu}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500">Heure</p>
                                            <p className="text-sm font-medium text-gray-800">{programme.heure || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                        <p className="text-sm font-semibold text-gray-900">Description</p>
                                        <p className="mt-1 text-sm text-gray-700">{programme.description || 'Aucune description fournie.'}</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">Graphique d'évolution</h3>
                                    <p className="mb-4 text-sm text-gray-500">Suivi des participants par date.</p>
                                    <PresenceChart presences={sortedPresences} />
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Tableau des présences</h3>
                                        <Button onClick={() => { setEditingPresence(null); setOpenForm(true); }}>Ajouter présence</Button>
                                    </div>
                                    <PresenceTable
                                        presences={sortedPresences}
                                        sortDirection={sortDirection}
                                        onSort={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                                        onEdit={(presence) => {
                                            setEditingPresence(presence);
                                            setOpenForm(true);
                                        }}
                                        onDelete={(presence) => setPresenceToDelete(presence)}
                                    />
                                </div>

                                <Timeline startDate={programme.date_debut} endDate={programme.date_fin} />
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-semibold text-gray-900">Actions rapides</p>
                                <div className="mt-4 flex flex-col gap-2">
                                    <Link href={`/programmes/${programme.id}/edit`}><Button className="w-full">Modifier le programme</Button></Link>
                                    <Link href="/programmes"><Button variant="secondary" className="w-full">Retour à la liste</Button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <PresenceForm
                    open={openForm}
                    onClose={() => {
                        setOpenForm(false);
                        setEditingPresence(null);
                    }}
                    onSubmit={handleSubmitPresence}
                    loading={loading}
                    initialValue={editingPresence}
                />

                <ConfirmDialog
                    open={Boolean(presenceToDelete)}
                    title="Supprimer cette présence ?"
                    description="Cette action est définitive."
                    onCancel={() => setPresenceToDelete(null)}
                    onConfirm={handleDeletePresence}
                />
            </PageContainer>
        </MainLayout>
    );
}

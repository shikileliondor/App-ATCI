import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';

export default function Show() {
    const { url } = usePage();
    const id = url.split('/')[2];

    const [programme, setProgramme] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [stats, setStats] = useState({ has_data: false });
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [participantForm, setParticipantForm] = useState({ nom: '', sexe: '', departement: '' });
    const [simpleCounts, setSimpleCounts] = useState({ expected: '', actual: '' });
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2800);
    };

    const loadDashboard = async () => {
        try {
            const response = await window.axios.get(`/api/programmes/${id}`);
            const payload = response.data?.data ?? {};
            setProgramme(payload.programme ?? null);
            setParticipants(payload.participants ?? []);
            setStats(payload.stats ?? { has_data: false });
            setSimpleCounts({
                expected: payload.programme?.expected_participants ?? '',
                actual: payload.programme?.actual_participants ?? '',
            });
            setError('');
        } catch {
            setError('Impossible de charger cet événement.');
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [id]);

    const updateProgrammeParticipants = async (payload) => {
        if (!programme) return;

        try {
            setLoading(true);
            await window.axios.put(`/api/programmes/${programme.id}`, payload);
            await loadDashboard();
        } catch {
            showToast('Erreur lors de la mise à jour.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const departmentRows = useMemo(
        () => Object.entries(stats.departments ?? {}),
        [stats.departments],
    );

    const handleCreateParticipant = async (event) => {
        event.preventDefault();
        if (!participantForm.nom.trim()) {
            showToast('Le nom du participant est requis.', 'error');
            return;
        }

        try {
            setLoading(true);
            await window.axios.post(`/api/programmes/${programme.id}/participants`, participantForm);
            setParticipantForm({ nom: '', sexe: '', departement: '' });
            showToast('Participant ajouté avec succès.');
            await loadDashboard();
        } catch {
            showToast('Erreur lors de l’ajout.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteParticipant = async (participantId) => {
        try {
            setLoading(true);
            await window.axios.delete(`/api/programmes/${programme.id}/participants/${participantId}`);
            showToast('Participant supprimé.');
            await loadDashboard();
        } catch {
            showToast('Erreur lors de la suppression.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Détail de l'événement" subtitle="Gestion des participants optionnelle et statistiques automatiques">
            <Head title="Détail événement" />
            <PageContainer>
                {toast ? (
                    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {toast.message}
                    </div>
                ) : null}

                {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

                {!programme ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-2xl font-semibold text-gray-900">{programme.nom}</h2>
                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{programme.type}</span>
                            </div>

                            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                <div><p className="text-xs uppercase text-gray-500">Début</p><p className="font-medium text-gray-800">{new Date(programme.date_debut).toLocaleDateString('fr-FR')}</p></div>
                                <div><p className="text-xs uppercase text-gray-500">Fin</p><p className="font-medium text-gray-800">{new Date(programme.date_fin).toLocaleDateString('fr-FR')}</p></div>
                                <div><p className="text-xs uppercase text-gray-500">Heure</p><p className="font-medium text-gray-800">{programme.heure || 'Non définie'}</p></div>
                                <div><p className="text-xs uppercase text-gray-500">Lieu</p><p className="font-medium text-gray-800">{programme.lieu}</p></div>
                            </div>

                            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-sm font-semibold text-gray-900">Description</p>
                                <p className="mt-1 text-sm text-gray-700">{programme.description || 'Aucune description fournie.'}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
                                    <p className="text-sm text-gray-500">Activez ce module seulement si nécessaire.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => updateProgrammeParticipants({ participants_enabled: !programme.participants_enabled })}
                                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${programme.participants_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}
                                    disabled={loading}
                                >
                                    {programme.participants_enabled ? 'Participants activés' : 'Activer les participants'}
                                </button>
                            </div>

                            {!programme.participants_enabled ? (
                                <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">Module inactif. L'événement reste entièrement fonctionnel sans participants.</p>
                            ) : (
                                <>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <label className="space-y-1 text-sm">
                                            <span className="text-gray-700">Mode</span>
                                            <select
                                                value={programme.participants_mode ?? 'simple'}
                                                onChange={(event) => updateProgrammeParticipants({ participants_enabled: true, participants_mode: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 px-3 py-2"
                                            >
                                                <option value="simple">Mode simple</option>
                                                <option value="avance">Mode avancé</option>
                                            </select>
                                        </label>

                                        <label className="space-y-1 text-sm">
                                            <span className="text-gray-700">Nombre attendu</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={simpleCounts.expected}
                                                onChange={(event) => setSimpleCounts((curr) => ({ ...curr, expected: event.target.value }))}
                                                onBlur={(event) => updateProgrammeParticipants({ participants_enabled: true, expected_participants: Number(event.target.value || 0) })}
                                                className="w-full rounded-xl border border-gray-200 px-3 py-2"
                                            />
                                        </label>

                                        <label className="space-y-1 text-sm">
                                            <span className="text-gray-700">Nombre réel</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={simpleCounts.actual}
                                                onChange={(event) => setSimpleCounts((curr) => ({ ...curr, actual: event.target.value }))}
                                                onBlur={(event) => updateProgrammeParticipants({ participants_enabled: true, actual_participants: Number(event.target.value || 0) })}
                                                className="w-full rounded-xl border border-gray-200 px-3 py-2"
                                            />
                                        </label>
                                    </div>

                                    {programme.participants_mode === 'avance' ? (
                                        <>
                                            <form onSubmit={handleCreateParticipant} className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-4">
                                                <input value={participantForm.nom} onChange={(event) => setParticipantForm((curr) => ({ ...curr, nom: event.target.value }))} placeholder="Nom" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                                                <select value={participantForm.sexe} onChange={(event) => setParticipantForm((curr) => ({ ...curr, sexe: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                                                    <option value="">Sexe</option>
                                                    <option value="homme">Homme</option>
                                                    <option value="femme">Femme</option>
                                                </select>
                                                <input value={participantForm.departement} onChange={(event) => setParticipantForm((curr) => ({ ...curr, departement: event.target.value }))} placeholder="Département" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                                                <Button type="submit" disabled={loading}>Ajouter</Button>
                                            </form>

                                            <div className="space-y-2">
                                                {participants.length === 0 ? <p className="text-sm text-gray-500">Aucun participant enregistré.</p> : participants.map((participant) => (
                                                    <div key={participant.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{participant.nom}</p>
                                                            <p className="text-gray-500">{participant.sexe || '—'} · {participant.departement || 'Sans département'}</p>
                                                        </div>
                                                        <button type="button" onClick={() => handleDeleteParticipant(participant.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600">Supprimer</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : null}

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="rounded-xl border border-gray-200 p-4">
                                            <p className="text-xs uppercase text-gray-500">Total participants</p>
                                            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.has_data ? stats.total : '—'}</p>
                                        </div>
                                        <div className="rounded-xl border border-gray-200 p-4">
                                            <p className="text-xs uppercase text-gray-500">Taux de présence</p>
                                            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.has_data && stats.attendance_rate !== null ? `${stats.attendance_rate}%` : '—'}</p>
                                        </div>
                                        <div className="rounded-xl border border-gray-200 p-4">
                                            <p className="text-xs uppercase text-gray-500">Répartition H/F</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {stats.has_data ? `${stats.gender_distribution?.hommes ?? 0} hommes / ${stats.gender_distribution?.femmes ?? 0} femmes` : '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {stats.has_data ? (
                                        <div className="rounded-xl border border-gray-200 p-4">
                                            <p className="text-sm font-semibold text-gray-900 mb-3">Répartition par département</p>
                                            {departmentRows.length === 0 ? <p className="text-sm text-gray-500">Aucune donnée disponible</p> : (
                                                <div className="space-y-2">
                                                    {departmentRows.map(([department, count]) => (
                                                        <div key={department}>
                                                            <div className="mb-1 flex justify-between text-xs text-gray-600"><span>{department}</span><span>{count}</span></div>
                                                            <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.min(100, (count / Math.max(stats.total, 1)) * 100)}%` }} /></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">Aucune donnée disponible</p>}
                                </>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Link href={`/programmes/${programme.id}/edit`}><Button>Modifier l'événement</Button></Link>
                            <Link href="/programmes"><Button variant="secondary">Retour à la liste</Button></Link>
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

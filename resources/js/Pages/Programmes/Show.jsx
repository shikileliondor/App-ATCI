import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';

function PercentBar({ label, value, total }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{label}</span>
                <span>{value} ({pct}%)</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function Show() {
    const { url } = usePage();
    const id = url.split('/')[2];

    const [programme, setProgramme] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [stats, setStats] = useState({ has_data: false, total: 0, attendance_rate: null, gender_distribution: {}, department_distribution: {} });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [settings, setSettings] = useState({ participants_enabled: false, participants_mode: 'simple', participants_expected: '', participants_actual: '' });
    const [participantForm, setParticipantForm] = useState({ nom: '', sexe: '', departement: '' });

    const loadDashboard = async () => {
        try {
            const response = await window.axios.get(`/api/programmes/${id}`);
            const payload = response.data?.data ?? {};
            const event = payload.programme ?? null;

            setProgramme(event);
            setParticipants(payload.participants ?? []);
            setStats(payload.stats ?? { has_data: false, total: 0, attendance_rate: null, gender_distribution: {}, department_distribution: {} });
            setSettings({
                participants_enabled: Boolean(event?.participants_enabled),
                participants_mode: event?.participants_mode ?? 'simple',
                participants_expected: event?.participants_expected ?? '',
                participants_actual: event?.participants_actual ?? '',
            });
            setError('');
        } catch {
            setError('Impossible de charger cet événement.');
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [id]);

    const saveSettings = async () => {
        try {
            setLoading(true);
            await window.axios.put(`/api/programmes/${id}/participants/settings`, {
                participants_enabled: settings.participants_enabled,
                participants_mode: settings.participants_enabled ? settings.participants_mode : null,
                participants_expected: settings.participants_enabled ? (settings.participants_expected === '' ? null : Number(settings.participants_expected)) : null,
                participants_actual: settings.participants_enabled ? (settings.participants_actual === '' ? null : Number(settings.participants_actual)) : null,
            });
            await loadDashboard();
        } catch {
            setError('Impossible d’enregistrer la configuration des participants.');
        } finally {
            setLoading(false);
        }
    };

    const addParticipant = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            await window.axios.post(`/api/programmes/${id}/participants`, {
                nom: participantForm.nom,
                sexe: participantForm.sexe || null,
                departement: participantForm.departement || null,
            });
            setParticipantForm({ nom: '', sexe: '', departement: '' });
            await loadDashboard();
        } catch {
            setError('Impossible d’ajouter ce participant.');
        } finally {
            setLoading(false);
        }
    };

    const removeParticipant = async (participantId) => {
        try {
            setLoading(true);
            await window.axios.delete(`/api/programmes/${id}/participants/${participantId}`);
            await loadDashboard();
        } catch {
            setError('Impossible de supprimer ce participant.');
        } finally {
            setLoading(false);
        }
    };

    const totalGender = useMemo(() => Object.values(stats.gender_distribution ?? {}).reduce((sum, value) => sum + Number(value), 0), [stats.gender_distribution]);
    const totalDepartments = useMemo(() => Object.values(stats.department_distribution ?? {}).reduce((sum, value) => sum + Number(value), 0), [stats.department_distribution]);

    return (
        <MainLayout title="Détail événement" subtitle="Vue moderne avec participants optionnels">
            <Head title="Détail événement" />
            <PageContainer>
                {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

                {!programme ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{programme.nom}</h2>
                                    <p className="text-sm text-gray-500">{programme.type} • {programme.lieu}</p>
                                </div>
                                <Link href={`/programmes/${programme.id}/edit`}><Button>Modifier</Button></Link>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
                                <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-500">Date</p><p className="font-medium text-gray-900">{new Date(programme.date_debut).toLocaleDateString('fr-FR')} → {new Date(programme.date_fin).toLocaleDateString('fr-FR')}</p></div>
                                <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-500">Heure</p><p className="font-medium text-gray-900">{programme.heure || 'Non définie'}</p></div>
                                <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-500">Description</p><p className="font-medium text-gray-900">{programme.description || 'Aucune description'}</p></div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
                                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={settings.participants_enabled}
                                        onChange={(event) => setSettings((prev) => ({ ...prev, participants_enabled: event.target.checked }))}
                                    />
                                    Activer les participants
                                </label>
                            </div>

                            {settings.participants_enabled ? (
                                <>
                                    <div className="grid gap-3 md:grid-cols-4">
                                        <label className="space-y-1 text-sm">
                                            <span className="text-gray-600">Mode</span>
                                            <select value={settings.participants_mode} onChange={(event) => setSettings((prev) => ({ ...prev, participants_mode: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2">
                                                <option value="simple">Simple (nombres)</option>
                                                <option value="advanced">Avancé (liste)</option>
                                            </select>
                                        </label>
                                        <label className="space-y-1 text-sm">
                                            <span className="text-gray-600">Nombre attendu</span>
                                            <input type="number" min={0} value={settings.participants_expected} onChange={(event) => setSettings((prev) => ({ ...prev, participants_expected: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                                        </label>
                                        <label className="space-y-1 text-sm">
                                            <span className="text-gray-600">Nombre réel</span>
                                            <input type="number" min={0} value={settings.participants_actual} onChange={(event) => setSettings((prev) => ({ ...prev, participants_actual: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2" disabled={settings.participants_mode === 'advanced'} />
                                        </label>
                                        <div className="flex items-end">
                                            <Button onClick={saveSettings} disabled={loading} className="w-full">Enregistrer</Button>
                                        </div>
                                    </div>

                                    {settings.participants_mode === 'advanced' ? (
                                        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                            <form className="grid gap-3 md:grid-cols-4" onSubmit={addParticipant}>
                                                <input required placeholder="Nom" value={participantForm.nom} onChange={(event) => setParticipantForm((prev) => ({ ...prev, nom: event.target.value }))} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                                                <select value={participantForm.sexe} onChange={(event) => setParticipantForm((prev) => ({ ...prev, sexe: event.target.value }))} className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                                    <option value="">Sexe (optionnel)</option>
                                                    <option value="homme">Homme</option>
                                                    <option value="femme">Femme</option>
                                                </select>
                                                <input placeholder="Département (optionnel)" value={participantForm.departement} onChange={(event) => setParticipantForm((prev) => ({ ...prev, departement: event.target.value }))} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                                                <Button type="submit" disabled={loading}>Ajouter</Button>
                                            </form>

                                            <div className="space-y-2">
                                                {participants.length === 0 ? <p className="text-sm text-gray-500">Aucun participant ajouté.</p> : participants.map((participant) => (
                                                    <div key={participant.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                                                        <span>{participant.nom} {participant.sexe ? `• ${participant.sexe}` : ''} {participant.departement ? `• ${participant.departement}` : ''}</span>
                                                        <button type="button" className="text-red-600" onClick={() => removeParticipant(participant.id)}>Supprimer</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                                    Activez les participants pour ajouter un suivi (optionnel).
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>

                            {!stats.has_data ? (
                                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">Aucune donnée disponible</p>
                            ) : (
                                <>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <div className="rounded-xl bg-blue-50 p-4"><p className="text-xs text-blue-700">Total participants</p><p className="text-2xl font-bold text-blue-900">{stats.total}</p></div>
                                        <div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs text-emerald-700">Taux de présence</p><p className="text-2xl font-bold text-emerald-900">{stats.attendance_rate ?? '-'}{stats.attendance_rate !== null ? '%' : ''}</p></div>
                                        <div className="rounded-xl bg-purple-50 p-4"><p className="text-xs text-purple-700">Mode</p><p className="text-2xl font-bold text-purple-900">{programme.participants_mode === 'advanced' ? 'Avancé' : 'Simple'}</p></div>
                                    </div>

                                    {Object.keys(stats.gender_distribution ?? {}).length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Répartition hommes / femmes</p>
                                            {Object.entries(stats.gender_distribution).map(([key, value]) => (
                                                <PercentBar key={key} label={key} value={Number(value)} total={totalGender} />
                                            ))}
                                        </div>
                                    ) : null}

                                    {Object.keys(stats.department_distribution ?? {}).length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Répartition par département</p>
                                            {Object.entries(stats.department_distribution).map(([key, value]) => (
                                                <PercentBar key={key} label={key} value={Number(value)} total={totalDepartments} />
                                            ))}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

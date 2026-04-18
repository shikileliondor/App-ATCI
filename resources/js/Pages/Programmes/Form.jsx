import { Link } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import Button from '@/Components/ui/Button';
import DateRangePicker from '@/Components/programmes/DateRangePicker';

const PRESENCE_FIELDS = [
    { key: 'hommes_adultes', label: 'Hommes adultes' },
    { key: 'femmes_adultes', label: 'Femmes adultes' },
    { key: 'jeunes_hommes', label: 'Jeunes hommes' },
    { key: 'jeunes_filles', label: 'Jeunes filles' },
    { key: 'enfants', label: 'Enfants' },
    { key: 'visiteurs', label: 'Visiteurs' },
];

function toIsoDate(date) {
    return date.toISOString().slice(0, 10);
}

function enumerateDates(startDate, endDate) {
    if (!startDate || !endDate) return [];

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end < start) return [];

    const dates = [];
    const cursor = new Date(start);

    while (cursor <= end) {
        dates.push(toIsoDate(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
}

function emptyPresence(date) {
    return {
        date,
        hommes_adultes: 0,
        femmes_adultes: 0,
        jeunes_hommes: 0,
        jeunes_filles: 0,
        enfants: 0,
        visiteurs: 0,
    };
}

function presenceTotal(presence) {
    return PRESENCE_FIELDS.reduce((sum, field) => sum + Number(presence?.[field.key] ?? 0), 0);
}

export default function ProgrammesForm({ values, setValues, errors = {}, onSubmit, processing, submitLabel = 'Enregistrer' }) {
    const expectedDates = useMemo(
        () => enumerateDates(values.date_debut, values.date_fin),
        [values.date_debut, values.date_fin],
    );

    useEffect(() => {
        if (expectedDates.length === 0) {
            if ((values.presences ?? []).length === 0) {
                return;
            }

            setValues((current) => ({ ...current, presences: [] }));
            return;
        }

        const currentPresences = values.presences ?? [];
        const byDate = new Map(currentPresences.map((presence) => [presence.date, presence]));

        const nextPresences = expectedDates.map((date) => {
            const existing = byDate.get(date);
            if (!existing) return emptyPresence(date);

            return {
                ...emptyPresence(date),
                ...existing,
                date,
            };
        });

        const changed = JSON.stringify(nextPresences) !== JSON.stringify(currentPresences);
        if (changed) {
            setValues((current) => ({ ...current, presences: nextPresences }));
        }
    }, [expectedDates, setValues, values.presences]);

    const updatePresenceField = (index, field, rawValue) => {
        const value = Math.max(0, Number(rawValue || 0));
        setValues((current) => {
            const next = [...(current.presences ?? [])];
            next[index] = {
                ...next[index],
                [field]: value,
            };

            return {
                ...current,
                presences: next,
            };
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Nom du programme</span>
                <input
                    value={values.nom}
                    onChange={(event) => setValues((current) => ({ ...current, nom: event.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.nom ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="Ex: 7 jours de jeûne et prière"
                />
                {errors.nom ? <p className="text-xs text-red-600">{errors.nom}</p> : null}
            </label>

            <DateRangePicker
                startDate={values.date_debut}
                endDate={values.date_fin}
                onStartChange={(date) => setValues((current) => ({ ...current, date_debut: date }))}
                onEndChange={(date) => setValues((current) => ({ ...current, date_fin: date }))}
                errors={errors}
            />

            <label className="space-y-1.5 block">
                <span className="text-sm font-medium text-gray-700">Lieu</span>
                <input
                    value={values.lieu}
                    onChange={(event) => setValues((current) => ({ ...current, lieu: event.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.lieu ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.lieu ? <p className="text-xs text-red-600">{errors.lieu}</p> : null}
            </label>

            <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Description</span>
                <textarea
                    rows={4}
                    value={values.description}
                    onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                />
            </label>

            <section className="space-y-3 rounded-2xl border border-gray-200 p-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Statistiques journalières</h3>
                    <p className="text-xs text-gray-500">1 culte par jour, valeurs à 0 par défaut.</p>
                </div>

                {expectedDates.length === 0 ? (
                    <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">Sélectionnez une date de début et de fin pour générer les jours.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Date</th>
                                    {PRESENCE_FIELDS.map((field) => (
                                        <th key={field.key} className="px-2 py-2 text-left font-semibold text-gray-600">{field.label}</th>
                                    ))}
                                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(values.presences ?? []).map((presence, index) => (
                                    <tr key={presence.date}>
                                        <td className="whitespace-nowrap px-2 py-2 text-gray-700">{new Date(`${presence.date}T00:00:00`).toLocaleDateString('fr-FR')}</td>
                                        {PRESENCE_FIELDS.map((field) => (
                                            <td key={`${presence.date}-${field.key}`} className="px-2 py-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={presence[field.key] ?? 0}
                                                    onChange={(event) => updatePresenceField(index, field.key, event.target.value)}
                                                    className="w-24 rounded-lg border border-gray-200 px-2 py-1.5"
                                                />
                                            </td>
                                        ))}
                                        <td className="px-2 py-2 font-semibold text-gray-900">{presenceTotal(presence)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {errors.date_range ? <p className="text-sm text-red-600">{errors.date_range}</p> : null}

            <div className="flex justify-end gap-2">
                <Link href="/programmes" className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700">Annuler</Link>
                <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : submitLabel}</Button>
            </div>
        </form>
    );
}

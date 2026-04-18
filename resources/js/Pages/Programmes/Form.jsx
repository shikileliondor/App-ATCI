import { Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';

const EVENT_TYPES = [
    'Réunion spéciale',
    'Séminaire',
    'Conférence',
    'Retraite',
    'Formation',
    'Jeunesse',
    'Autre',
];

export default function ProgrammesForm({ values, setValues, errors = {}, onSubmit, processing, submitLabel = 'Enregistrer' }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Nom de l'événement</span>
                    <input
                        value={values.nom}
                        onChange={(event) => setValues((current) => ({ ...current, nom: event.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.nom ? 'border-red-400' : 'border-gray-200'}`}
                        placeholder="Ex: Conférence de leadership"
                    />
                    {errors.nom ? <p className="text-xs text-red-600">{errors.nom}</p> : null}
                </label>

                <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Type</span>
                    <select
                        value={values.type}
                        onChange={(event) => setValues((current) => ({ ...current, type: event.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.type ? 'border-red-400' : 'border-gray-200'}`}
                    >
                        <option value="">Sélectionner un type</option>
                        {EVENT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.type ? <p className="text-xs text-red-600">{errors.type}</p> : null}
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Date début</span>
                    <input
                        type="date"
                        value={values.date_debut}
                        onChange={(event) => setValues((current) => ({ ...current, date_debut: event.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.date_debut ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.date_debut ? <p className="text-xs text-red-600">{errors.date_debut}</p> : null}
                </label>

                <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Date fin</span>
                    <input
                        type="date"
                        value={values.date_fin}
                        onChange={(event) => setValues((current) => ({ ...current, date_fin: event.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.date_fin ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.date_fin ? <p className="text-xs text-red-600">{errors.date_fin}</p> : null}
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Heure</span>
                    <input
                        type="time"
                        value={values.heure}
                        onChange={(event) => setValues((current) => ({ ...current, heure: event.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.heure ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.heure ? <p className="text-xs text-red-600">{errors.heure}</p> : null}
                </label>

                <label className="space-y-1.5 block">
                    <span className="text-sm font-medium text-gray-700">Lieu</span>
                    <input
                        value={values.lieu}
                        onChange={(event) => setValues((current) => ({ ...current, lieu: event.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm ${errors.lieu ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.lieu ? <p className="text-xs text-red-600">{errors.lieu}</p> : null}
                </label>
            </div>

            <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Description</span>
                <textarea
                    rows={4}
                    value={values.description}
                    onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                />
            </label>

            {errors.date_range ? <p className="text-sm text-red-600">{errors.date_range}</p> : null}

            <div className="flex justify-end gap-2">
                <Link href="/programmes" className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700">Annuler</Link>
                <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : submitLabel}</Button>
            </div>
        </form>
    );
}

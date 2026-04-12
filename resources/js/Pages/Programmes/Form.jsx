import { Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';
import DateRangePicker from '@/Components/programmes/DateRangePicker';

export default function ProgrammesForm({ values, setValues, errors = {}, onSubmit, processing, submitLabel = 'Enregistrer' }) {
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

            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Heure (optionnel)</span>
                    <input type="time" value={values.heure || ''} onChange={(event) => setValues((current) => ({ ...current, heure: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                </label>
                <label className="space-y-1.5">
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

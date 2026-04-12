import { Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';
import FormInput from '@/Components/crud/FormInput';

const culteTypes = ['Dimanche', 'Prière', 'Veillée', 'Enseignement', 'Autre'];

export default function CultesForm({ values, setValues, errors = {}, onSubmit, processing }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Type</span>
                    <select value={values.theme} onChange={(event) => setValues((c) => ({ ...c, theme: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                        <option value="">Sélectionner</option>
                        {culteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                </label>
                <FormInput type="date" label="Date" value={values.date_culte} onChange={(event) => setValues((c) => ({ ...c, date_culte: event.target.value }))} error={errors.date_culte} />
                <FormInput type="time" label="Heure" value={values.heure} onChange={(event) => setValues((c) => ({ ...c, heure: event.target.value }))} />
                <FormInput label="Lieu" value={values.lieu} onChange={(event) => setValues((c) => ({ ...c, lieu: event.target.value }))} />
            </div>

            <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Description / Notes</span>
                <textarea value={values.observations} onChange={(event) => setValues((c) => ({ ...c, observations: event.target.value }))} rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
            </label>

            <div className="grid gap-3 md:grid-cols-3">
                <FormInput type="number" min={0} label="Hommes adultes" value={values.hommes_adultes} onChange={(event) => setValues((c) => ({ ...c, hommes_adultes: event.target.value }))} />
                <FormInput type="number" min={0} label="Femmes adultes" value={values.femmes_adultes} onChange={(event) => setValues((c) => ({ ...c, femmes_adultes: event.target.value }))} />
                <FormInput type="number" min={0} label="Jeunes hommes" value={values.jeunes_hommes} onChange={(event) => setValues((c) => ({ ...c, jeunes_hommes: event.target.value }))} />
                <FormInput type="number" min={0} label="Jeunes filles" value={values.jeunes_filles} onChange={(event) => setValues((c) => ({ ...c, jeunes_filles: event.target.value }))} />
                <FormInput type="number" min={0} label="Enfants" value={values.enfants} onChange={(event) => setValues((c) => ({ ...c, enfants: event.target.value }))} />
                <FormInput type="number" min={0} label="Visiteurs" value={values.visiteurs} onChange={(event) => setValues((c) => ({ ...c, visiteurs: event.target.value }))} />
            </div>

            <div className="flex justify-end gap-2">
                <Link href="/cultes" className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700">Annuler</Link>
                <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : 'Enregistrer culte'}</Button>
            </div>
        </form>
    );
}

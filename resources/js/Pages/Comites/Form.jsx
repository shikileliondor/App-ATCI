import { Link } from '@inertiajs/react';

export default function Form({ data, setData, departements = [], errors, processing, onSubmit, submitLabel, cancelHref = '/comites' }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="nom" className="mb-1.5 block text-sm font-medium text-gray-700">Nom du comité</label>
                    <input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                    {errors.nom ? <p className="mt-1.5 text-sm text-red-600">{errors.nom}</p> : null}
                </div>
                <div>
                    <label htmlFor="departement_id" className="mb-1.5 block text-sm font-medium text-gray-700">Département associé</label>
                    <select id="departement_id" value={data.departement_id} onChange={(e) => setData('departement_id', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                        <option value="">Sélectionner...</option>
                        {departements.map((dep) => <option key={dep.id} value={dep.id}>{dep.nom}</option>)}
                    </select>
                    {errors.departement_id ? <p className="mt-1.5 text-sm text-red-600">{errors.departement_id}</p> : null}
                </div>
            </div>
            <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                {errors.description ? <p className="mt-1.5 text-sm text-red-600">{errors.description}</p> : null}
            </div>
            <div>
                <label htmlFor="statut" className="mb-1.5 block text-sm font-medium text-gray-700">Statut</label>
                <select id="statut" value={data.statut} onChange={(e) => setData('statut', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                    <option value="actif">Actif</option><option value="inactif">Inactif</option>
                </select>
                {errors.statut ? <p className="mt-1.5 text-sm text-red-600">{errors.statut}</p> : null}
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <Link href={cancelHref} className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</Link>
                <button type="submit" disabled={processing} className="inline-flex items-center justify-center rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#174b8a] disabled:opacity-60">{processing ? 'Traitement...' : submitLabel}</button>
            </div>
        </form>
    );
}

import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';

function Card({ children, className = '' }) {
    return <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

const situationOptions = [
    { value: 'celibataire', label: 'Célibataire' },
    { value: 'marie', label: 'Marié(e)' },
    { value: 'veuf', label: 'Veuf/Veuve' },
    { value: 'divorce', label: 'Divorcé(e)' },
    { value: 'concubin', label: 'Concubinage' },
];

export default function Create() {
    const { departements = [], comites = [] } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        sexe: 'homme',
        date_naissance: '',
        telephone: '',
        email: '',
        adresse: '',
        departement_id: '',
        comite_id: '',
        est_converti: false,
        date_conversion: '',
        est_baptise: false,
        date_bapteme: '',
        situation_matrimoniale: 'celibataire',
        profession: '',
        statut: 'actif',
        date_inscription: new Date().toISOString().slice(0, 10),
        observations: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/membres');
    };

    return (
        <MainLayout title="Ajouter membre" subtitle="Enregistrez un nouveau membre">
            <Head title="Ajouter membre" />

            <PageContainer>
                <Card className="mx-auto w-full max-w-5xl">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[
                                ['nom', 'Nom'],
                                ['prenom', 'Prénom'],
                                ['telephone', 'Téléphone'],
                                ['email', 'Email'],
                                ['profession', 'Profession'],
                            ].map(([field, label]) => (
                                <div key={field}>
                                    <label htmlFor={field} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
                                    <input
                                        id={field}
                                        type={field === 'email' ? 'email' : 'text'}
                                        value={data[field]}
                                        onChange={(e) => setData(field, e.target.value)}
                                        className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]"
                                    />
                                    {errors[field] ? <p className="mt-1.5 text-sm text-red-600">{errors[field]}</p> : null}
                                </div>
                            ))}

                            <div>
                                <label htmlFor="sexe" className="mb-1.5 block text-sm font-medium text-gray-700">Sexe</label>
                                <select id="sexe" value={data.sexe} onChange={(e) => setData('sexe', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                                    <option value="homme">Homme</option>
                                    <option value="femme">Femme</option>
                                </select>
                                {errors.sexe ? <p className="mt-1.5 text-sm text-red-600">{errors.sexe}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="situation_matrimoniale" className="mb-1.5 block text-sm font-medium text-gray-700">Situation matrimoniale</label>
                                <select id="situation_matrimoniale" value={data.situation_matrimoniale} onChange={(e) => setData('situation_matrimoniale', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                                    {situationOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors.situation_matrimoniale ? <p className="mt-1.5 text-sm text-red-600">{errors.situation_matrimoniale}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="statut" className="mb-1.5 block text-sm font-medium text-gray-700">Statut</label>
                                <select id="statut" value={data.statut} onChange={(e) => setData('statut', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                                    <option value="actif">Actif</option>
                                    <option value="inactif">Inactif</option>
                                </select>
                                {errors.statut ? <p className="mt-1.5 text-sm text-red-600">{errors.statut}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="departement_id" className="mb-1.5 block text-sm font-medium text-gray-700">Département</label>
                                <select id="departement_id" value={data.departement_id} onChange={(e) => setData('departement_id', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                                    <option value="">Sélectionner...</option>
                                    {departements.map((departement) => (
                                        <option key={departement.id} value={departement.id}>{departement.nom}</option>
                                    ))}
                                </select>
                                {errors.departement_id ? <p className="mt-1.5 text-sm text-red-600">{errors.departement_id}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="comite_id" className="mb-1.5 block text-sm font-medium text-gray-700">Comité (optionnel)</label>
                                <select id="comite_id" value={data.comite_id} onChange={(e) => setData('comite_id', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]">
                                    <option value="">Aucun</option>
                                    {comites.map((comite) => (
                                        <option key={comite.id} value={comite.id}>{comite.nom}</option>
                                    ))}
                                </select>
                                {errors.comite_id ? <p className="mt-1.5 text-sm text-red-600">{errors.comite_id}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="date_naissance" className="mb-1.5 block text-sm font-medium text-gray-700">Date de naissance</label>
                                <input id="date_naissance" type="date" value={data.date_naissance} onChange={(e) => setData('date_naissance', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                                {errors.date_naissance ? <p className="mt-1.5 text-sm text-red-600">{errors.date_naissance}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="date_inscription" className="mb-1.5 block text-sm font-medium text-gray-700">Date inscription</label>
                                <input id="date_inscription" type="date" value={data.date_inscription} onChange={(e) => setData('date_inscription', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                                {errors.date_inscription ? <p className="mt-1.5 text-sm text-red-600">{errors.date_inscription}</p> : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="adresse" className="mb-1.5 block text-sm font-medium text-gray-700">Adresse</label>
                            <textarea id="adresse" value={data.adresse} onChange={(e) => setData('adresse', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" rows={2} />
                            {errors.adresse ? <p className="mt-1.5 text-sm text-red-600">{errors.adresse}</p> : null}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input type="checkbox" checked={data.est_converti} onChange={(e) => setData('est_converti', e.target.checked)} className="rounded border-gray-300 text-[#1a56a0] focus:ring-[#1a56a0]" />
                                Converti
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input type="checkbox" checked={data.est_baptise} onChange={(e) => setData('est_baptise', e.target.checked)} className="rounded border-gray-300 text-[#1a56a0] focus:ring-[#1a56a0]" />
                                Baptisé
                            </label>

                            <div>
                                <label htmlFor="date_conversion" className="mb-1.5 block text-sm font-medium text-gray-700">Date conversion</label>
                                <input id="date_conversion" type="date" disabled={!data.est_converti} value={data.date_conversion} onChange={(e) => setData('date_conversion', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm disabled:bg-gray-100 focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                                {errors.date_conversion ? <p className="mt-1.5 text-sm text-red-600">{errors.date_conversion}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="date_bapteme" className="mb-1.5 block text-sm font-medium text-gray-700">Date baptême</label>
                                <input id="date_bapteme" type="date" disabled={!data.est_baptise} value={data.date_bapteme} onChange={(e) => setData('date_bapteme', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm disabled:bg-gray-100 focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                                {errors.date_bapteme ? <p className="mt-1.5 text-sm text-red-600">{errors.date_bapteme}</p> : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="observations" className="mb-1.5 block text-sm font-medium text-gray-700">Observations</label>
                            <textarea id="observations" value={data.observations} onChange={(e) => setData('observations', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" rows={3} />
                            {errors.observations ? <p className="mt-1.5 text-sm text-red-600">{errors.observations}</p> : null}
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                            <Link href="/membres" className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                                Annuler
                            </Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center justify-center rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#174b8a] disabled:cursor-not-allowed disabled:opacity-60">
                                {processing ? 'Enregistrement...' : 'Créer le membre'}
                            </button>
                        </div>
                    </form>
                </Card>
            </PageContainer>
        </MainLayout>
    );
}

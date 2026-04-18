import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
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

const formatDate = (value) => (value ? String(value).slice(0, 10) : '');

export default function Edit() {
    const { membre, departements = [], comites = [], general = {} } = usePage().props;
    const memberPhotoUrl = useMemo(() => (membre?.photo_path ? `/storage/${membre.photo_path}` : null), [membre?.photo_path]);
    const logoUrl = useMemo(() => (general?.logo_path ? `/storage/${general.logo_path}` : null), [general?.logo_path]);

    const { data, setData, put, processing, errors } = useForm({
        nom: membre?.nom ?? '',
        prenom: membre?.prenom ?? '',
        sexe: membre?.sexe ?? 'homme',
        date_naissance: formatDate(membre?.date_naissance),
        telephone: membre?.telephone ?? '',
        email: membre?.email ?? '',
        photo: null,
        remove_photo: false,
        adresse: membre?.adresse ?? '',
        departement_id: membre?.departement_id ? String(membre.departement_id) : '',
        comite_id: membre?.comite_id ? String(membre.comite_id) : '',
        est_baptise: Boolean(membre?.est_baptise),
        date_bapteme: formatDate(membre?.date_bapteme),
        situation_matrimoniale: membre?.situation_matrimoniale ?? 'celibataire',
        profession: membre?.profession ?? '',
        fonction_eglise: membre?.fonction_eglise ?? '',
        niveau_etude: membre?.niveau_etude ?? '',
        contact_urgence_nom: membre?.contact_urgence_nom ?? '',
        contact_urgence_telephone: membre?.contact_urgence_telephone ?? '',
        statut: membre?.statut ?? 'actif',
        date_inscription: formatDate(membre?.date_inscription),
        observations: membre?.observations ?? '',
        pdf_afficher_logo: Boolean(membre?.pdf_afficher_logo ?? true),
        pdf_afficher_nom_eglise: Boolean(membre?.pdf_afficher_nom_eglise ?? true),
        pdf_titre_document: membre?.pdf_titre_document ?? 'Fiche de membre',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/membres/${membre.id}`, { forceFormData: true });
    };

    return (
        <MainLayout title="Modifier membre" subtitle="Mettez à jour les informations du membre">
            <Head title="Modifier membre" />

            <PageContainer>
                <Card className="mx-auto w-full max-w-5xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[
                                ['nom', 'Nom'],
                                ['prenom', 'Prénom'],
                                ['telephone', 'Téléphone'],
                                ['email', 'Email'],
                            ].map(([field, label]) => (
                                <div key={field}>
                                    <label htmlFor={field} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
                                    <input id={field} type={field === 'email' ? 'email' : 'text'} value={data[field]} onChange={(e) => setData(field, e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" />
                                    {errors[field] ? <p className="mt-1.5 text-sm text-red-600">{errors[field]}</p> : null}
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label htmlFor="photo" className="mb-1.5 block text-sm font-medium text-gray-700">Photo du membre</label>
                                <input id="photo" type="file" accept="image/*" onChange={(e) => { setData('remove_photo', false); setData('photo', e.target.files?.[0] ?? null); }} className="w-full rounded-xl border-gray-300 text-sm" />
                                {memberPhotoUrl && !data.remove_photo ? <img src={memberPhotoUrl} alt="Photo membre" className="h-20 w-20 rounded-xl border border-gray-200 object-cover" /> : null}
                                {memberPhotoUrl ? <label className="flex items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked={data.remove_photo} onChange={(e) => setData('remove_photo', e.target.checked)} className="rounded border-gray-300" />Supprimer la photo actuelle</label> : null}
                                {errors.photo ? <p className="mt-1.5 text-sm text-red-600">{errors.photo}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="sexe" className="mb-1.5 block text-sm font-medium text-gray-700">Sexe</label>
                                <select id="sexe" value={data.sexe} onChange={(e) => setData('sexe', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]"><option value="homme">Homme</option><option value="femme">Femme</option></select>
                            </div>

                            <div><label htmlFor="date_naissance" className="mb-1.5 block text-sm font-medium text-gray-700">Date de naissance</label><input id="date_naissance" type="date" value={data.date_naissance} onChange={(e) => setData('date_naissance', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" /></div>
                            <div><label htmlFor="situation_matrimoniale" className="mb-1.5 block text-sm font-medium text-gray-700">Situation matrimoniale</label><select id="situation_matrimoniale" value={data.situation_matrimoniale} onChange={(e) => setData('situation_matrimoniale', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm">{situationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                            <div><label htmlFor="statut" className="mb-1.5 block text-sm font-medium text-gray-700">Statut</label><select id="statut" value={data.statut} onChange={(e) => setData('statut', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm"><option value="actif">Actif</option><option value="inactif">Inactif</option></select></div>
                            <div><label htmlFor="departement_id" className="mb-1.5 block text-sm font-medium text-gray-700">Département</label><select id="departement_id" value={data.departement_id} onChange={(e) => setData('departement_id', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm"><option value="">Sélectionner...</option>{departements.map((departement) => <option key={departement.id} value={departement.id}>{departement.nom}</option>)}</select></div>
                            <div><label htmlFor="comite_id" className="mb-1.5 block text-sm font-medium text-gray-700">Comité (optionnel)</label><select id="comite_id" value={data.comite_id} onChange={(e) => setData('comite_id', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm"><option value="">Aucun</option>{comites.map((comite) => <option key={comite.id} value={comite.id}>{comite.nom}</option>)}</select></div>
                            <div><label htmlFor="date_inscription" className="mb-1.5 block text-sm font-medium text-gray-700">Date inscription</label><input id="date_inscription" type="date" value={data.date_inscription} onChange={(e) => setData('date_inscription', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                        </div>

                        <div><label htmlFor="adresse" className="mb-1.5 block text-sm font-medium text-gray-700">Adresse</label><textarea id="adresse" value={data.adresse} onChange={(e) => setData('adresse', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" rows={2} /></div>

                        <div className="grid gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" checked={data.est_baptise} onChange={(e) => setData('est_baptise', e.target.checked)} className="rounded border-gray-300 text-[#1a56a0] focus:ring-[#1a56a0]" />Baptisé</label>
                            <div><label htmlFor="date_bapteme" className="mb-1.5 block text-sm font-medium text-gray-700">Date baptême</label><input id="date_bapteme" type="date" disabled={!data.est_baptise} value={data.date_bapteme} onChange={(e) => setData('date_bapteme', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm disabled:bg-gray-100" /></div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div><label htmlFor="profession" className="mb-1.5 block text-sm font-medium text-gray-700">Profession</label><input id="profession" value={data.profession} onChange={(e) => setData('profession', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                            <div><label htmlFor="fonction_eglise" className="mb-1.5 block text-sm font-medium text-gray-700">Fonction dans l'église</label><input id="fonction_eglise" value={data.fonction_eglise} onChange={(e) => setData('fonction_eglise', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                            <div><label htmlFor="niveau_etude" className="mb-1.5 block text-sm font-medium text-gray-700">Niveau d'étude</label><input id="niveau_etude" value={data.niveau_etude} onChange={(e) => setData('niveau_etude', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                            <div><label htmlFor="contact_urgence_nom" className="mb-1.5 block text-sm font-medium text-gray-700">Contact d'urgence (Nom)</label><input id="contact_urgence_nom" value={data.contact_urgence_nom} onChange={(e) => setData('contact_urgence_nom', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                            <div><label htmlFor="contact_urgence_telephone" className="mb-1.5 block text-sm font-medium text-gray-700">Contact d'urgence (Téléphone)</label><input id="contact_urgence_telephone" value={data.contact_urgence_telephone} onChange={(e) => setData('contact_urgence_telephone', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                            <h3 className="text-sm font-semibold text-[#1a56a0]">Paramètres document PDF</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={data.pdf_afficher_logo} onChange={(e) => setData('pdf_afficher_logo', e.target.checked)} className="rounded border-gray-300 text-[#1a56a0]" />Afficher le logo</label>
                                <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={data.pdf_afficher_nom_eglise} onChange={(e) => setData('pdf_afficher_nom_eglise', e.target.checked)} className="rounded border-gray-300 text-[#1a56a0]" />Afficher le nom de l'église</label>
                            </div>
                            <div><label htmlFor="pdf_titre_document" className="mb-1.5 block text-sm font-medium text-gray-700">Titre du document</label><input id="pdf_titre_document" value={data.pdf_titre_document} onChange={(e) => setData('pdf_titre_document', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" /></div>
                            <div className="flex items-center gap-3 rounded-xl border border-dashed border-blue-200 bg-white p-3 text-xs text-gray-600">{data.pdf_afficher_logo && logoUrl ? <img src={logoUrl} alt="Logo église" className="h-10 w-10 rounded-md border border-gray-200 object-contain p-1" /> : null}<div><p className="font-medium text-gray-800">{data.pdf_titre_document || 'Fiche de membre'}</p>{data.pdf_afficher_nom_eglise ? <p>{general?.church_name || 'Nom de l\'église non défini'}</p> : null}</div></div>
                        </div>

                        <div><label htmlFor="observations" className="mb-1.5 block text-sm font-medium text-gray-700">Observations</label><textarea id="observations" value={data.observations} onChange={(e) => setData('observations', e.target.value)} className="w-full rounded-xl border-gray-300 text-sm" rows={3} /></div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                            <Link href="/membres" className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Annuler</Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center justify-center rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#174b8a] disabled:cursor-not-allowed disabled:opacity-60">{processing ? 'Mise à jour...' : 'Enregistrer les modifications'}</button>
                        </div>
                    </form>
                </Card>
            </PageContainer>
        </MainLayout>
    );
}

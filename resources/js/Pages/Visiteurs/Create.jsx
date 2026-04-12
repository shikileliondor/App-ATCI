import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import FormInput from '@/Components/app/FormInput';

const initialData = {
    nom: '',
    prenom: '',
    telephone: '',
    date_visite: '',
    motif_visite: '',
    commentaire: '',
};

export default function VisiteursCreate() {
    const [form, setForm] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.post('/api/visiteurs', form);
            router.visit('/visiteurs');
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Nouveau visiteur" subtitle="Ajoutez un visiteur à suivre">
            <Head title="Créer visiteur" />
            <PageContainer>
                <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormInput label="Nom" name="nom" value={form.nom} onChange={onChange} required error={errors.nom?.[0]} />
                        <FormInput label="Prénom" name="prenom" value={form.prenom} onChange={onChange} required error={errors.prenom?.[0]} />
                        <FormInput label="Téléphone" name="telephone" value={form.telephone} onChange={onChange} error={errors.telephone?.[0]} />
                        <FormInput label="Date de visite" type="date" name="date_visite" value={form.date_visite} onChange={onChange} required error={errors.date_visite?.[0]} />
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 md:col-span-2">
                            Les champs <strong>sexe</strong>, <strong>adresse</strong> et <strong>invité par</strong> ne sont pas encore disponibles côté backend. Ils sont regroupés dans « Invité par / Motif » et « Adresse / Commentaire » pour l'instant.
                        </div>
                        <FormInput label="Invité par / Motif" name="motif_visite" value={form.motif_visite} onChange={onChange} error={errors.motif_visite?.[0]} className="md:col-span-2" />
                        <label className="block space-y-1.5 md:col-span-2">
                            <span className="text-sm font-medium text-gray-700">Adresse / Commentaire</span>
                            <textarea name="commentaire" value={form.commentaire} onChange={onChange} rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link href="/visiteurs"><Button variant="secondary">Annuler</Button></Link>
                        <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : 'Enregistrer'}</Button>
                    </div>
                </form>
            </PageContainer>
        </MainLayout>
    );
}

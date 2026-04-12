import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import FormInput from '@/Components/app/FormInput';

export default function VisiteursEdit({ id }) {
    const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', date_visite: '', motif_visite: '', commentaire: '' });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`/api/visiteurs/${id}`).then(({ data }) => {
            setForm(data.data);
            setLoading(false);
        });
    }, [id]);

    const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.put(`/api/visiteurs/${id}`, form);
            router.visit('/visiteurs');
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Modifier visiteur" subtitle="Mettez à jour les informations">
            <Head title="Modifier visiteur" />
            <PageContainer>
                {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormInput label="Nom" name="nom" value={form.nom ?? ''} onChange={onChange} required error={errors.nom?.[0]} />
                            <FormInput label="Prénom" name="prenom" value={form.prenom ?? ''} onChange={onChange} required error={errors.prenom?.[0]} />
                            <FormInput label="Téléphone" name="telephone" value={form.telephone ?? ''} onChange={onChange} error={errors.telephone?.[0]} />
                            <FormInput label="Date de visite" type="date" name="date_visite" value={form.date_visite ?? ''} onChange={onChange} required error={errors.date_visite?.[0]} />
                            <FormInput label="Invité par / Motif" name="motif_visite" value={form.motif_visite ?? ''} onChange={onChange} error={errors.motif_visite?.[0]} className="md:col-span-2" />
                            <label className="block space-y-1.5 md:col-span-2">
                                <span className="text-sm font-medium text-gray-700">Adresse / Commentaire</span>
                                <textarea name="commentaire" value={form.commentaire ?? ''} onChange={onChange} rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                            </label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Link href="/visiteurs"><Button variant="secondary">Annuler</Button></Link>
                            <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                        </div>
                    </form>
                )}
            </PageContainer>
        </MainLayout>
    );
}

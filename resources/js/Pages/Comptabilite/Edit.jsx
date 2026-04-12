import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import FormInput from '@/Components/app/FormInput';
import FormSelect from '@/Components/app/FormSelect';

export default function ComptabiliteEdit({ id }) {
    const [form, setForm] = useState({ type: 'offrande', montant: '', date_operation: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`/api/comptabilites/${id}`).then(({ data }) => {
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
            await axios.put(`/api/comptabilites/${id}`, form);
            router.visit('/comptabilite');
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Modifier transaction" subtitle="Mise à jour d'une opération comptable">
            <Head title="Modifier transaction" />
            <PageContainer>
                {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormSelect
                                label="Catégorie"
                                name="type"
                                value={form.type ?? 'offrande'}
                                onChange={onChange}
                                required
                                error={errors.type?.[0]}
                                options={[
                                    { value: 'dime', label: 'Dîme (Entrée)' },
                                    { value: 'offrande', label: 'Offrande (Entrée)' },
                                    { value: 'don', label: 'Don (Entrée)' },
                                    { value: 'autre', label: 'Dépense / Sortie' },
                                ]}
                            />
                            <FormInput label="Montant" name="montant" type="number" step="0.01" value={form.montant ?? ''} onChange={onChange} required error={errors.montant?.[0]} />
                            <FormInput label="Date" type="date" name="date_operation" value={form.date_operation ?? ''} onChange={onChange} required error={errors.date_operation?.[0]} />
                            <div className="md:col-span-2">
                                <label className="block space-y-1.5">
                                    <span className="text-sm font-medium text-gray-700">Description</span>
                                    <textarea name="description" value={form.description ?? ''} onChange={onChange} rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Link href="/comptabilite"><Button variant="secondary">Annuler</Button></Link>
                            <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                        </div>
                    </form>
                )}
            </PageContainer>
        </MainLayout>
    );
}

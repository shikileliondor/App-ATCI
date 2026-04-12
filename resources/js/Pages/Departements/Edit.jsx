import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Form from './Form';

export default function Edit({ departement }) {
    const { data, setData, put, processing, errors } = useForm({ nom: departement.nom ?? '', description: departement.description ?? '', statut: departement.statut ?? 'actif' });
    return <MainLayout title="Modifier département" subtitle="Mettez à jour le département"><Head title="Modifier département" /><PageContainer><div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Form data={data} setData={setData} errors={errors} processing={processing} submitLabel="Mettre à jour" onSubmit={(e) => { e.preventDefault(); put(`/departements/${departement.id}`); }} /></div></PageContainer></MainLayout>;
}

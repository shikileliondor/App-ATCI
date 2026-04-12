import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Form from './Form';

export default function Edit({ comite, departements = [] }) {
    const { data, setData, put, processing, errors } = useForm({ nom: comite.nom ?? '', description: comite.description ?? '', departement_id: comite.departement_id ? String(comite.departement_id) : '', statut: comite.statut ?? 'actif' });
    return <MainLayout title="Modifier comité" subtitle="Mettez à jour le comité"><Head title="Modifier comité" /><PageContainer><div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Form data={data} setData={setData} departements={departements} errors={errors} processing={processing} submitLabel="Mettre à jour" onSubmit={(e) => { e.preventDefault(); put(`/comites/${comite.id}`); }} /></div></PageContainer></MainLayout>;
}

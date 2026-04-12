import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Form from './Form';

export default function Create({ departements = [] }) {
    const { data, setData, post, processing, errors } = useForm({ nom: '', description: '', departement_id: '', statut: 'actif' });
    return <MainLayout title="Nouveau comité" subtitle="Créer un comité"><Head title="Créer comité" /><PageContainer><div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Form data={data} setData={setData} departements={departements} errors={errors} processing={processing} submitLabel="Créer" onSubmit={(e) => { e.preventDefault(); post('/comites'); }} /></div></PageContainer></MainLayout>;
}

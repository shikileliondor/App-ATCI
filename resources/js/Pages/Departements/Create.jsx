import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Form from './Form';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({ nom: '', description: '', statut: 'actif' });
    return <MainLayout title="Nouveau département" subtitle="Créer un département"><Head title="Créer département" /><PageContainer><div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Form data={data} setData={setData} errors={errors} processing={processing} submitLabel="Créer" onSubmit={(e) => { e.preventDefault(); post('/departements'); }} /></div></PageContainer></MainLayout>;
}

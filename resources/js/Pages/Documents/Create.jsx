import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import DocumentsForm from '@/Pages/Documents/Form';

export default function Create() {
    const { props } = usePage();
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [values, setValues] = useState({
        titre: '',
        type: '',
        categorie: '',
        description: '',
        uploaded_by: props.auth?.user?.name ?? '',
        fichier: null,
    });

    const submit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const payload = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== null && value !== '') payload.append(key, value);
            });

            await window.axios.post('/api/documents', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            router.visit('/documents');
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Nouveau document" subtitle="Importer un document dans la bibliothèque">
            <Head title="Créer document" />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <DocumentsForm values={values} setValues={setValues} errors={errors} onSubmit={submit} processing={processing} />
                </div>
            </PageContainer>
        </MainLayout>
    );
}

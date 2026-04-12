import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import DocumentsForm from '@/Pages/Documents/Form';
import PreviewFile from '@/Components/crud/PreviewFile';

export default function Edit() {
    const { url } = usePage();
    const documentId = url.split('/')[2];
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [values, setValues] = useState({
        titre: '',
        type: '',
        categorie: '',
        description: '',
        fichier: null,
        existingFile: '',
    });

    useEffect(() => {
        const load = async () => {
            const response = await window.axios.get(`/api/documents/${documentId}`);
            const doc = response.data?.data;
            setValues((current) => ({
                ...current,
                titre: doc.titre ?? '',
                type: doc.type ?? '',
                categorie: doc.categorie ?? '',
                description: doc.description ?? '',
                existingFile: doc.fichier ?? '',
            }));
            setLoaded(true);
        };

        load();
    }, [documentId]);

    const submit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const payload = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (['existingFile'].includes(key)) return;
                if (value !== null && value !== '') payload.append(key, value);
            });
            payload.append('_method', 'PUT');
            await window.axios.post(`/api/documents/${documentId}`, payload, {
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
        <MainLayout title="Modifier document" subtitle="Mettez à jour les métadonnées ou le fichier">
            <Head title="Modifier document" />
            <PageContainer>
                {!loaded ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <DocumentsForm values={values} setValues={setValues} errors={errors} onSubmit={submit} processing={processing} isEdit />
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-base font-semibold text-gray-900">Aperçu du fichier actuel</h3>
                            <PreviewFile fileUrl={values.existingFile ? `/storage/${values.existingFile}` : null} type={values.type} />
                        </div>
                    </>
                )}
            </PageContainer>
        </MainLayout>
    );
}

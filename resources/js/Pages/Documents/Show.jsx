import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import PreviewFile from '@/Components/crud/PreviewFile';

export default function Show() {
    const { url } = usePage();
    const id = url.split('/')[2];
    const [document, setDocument] = useState(null);

    useEffect(() => {
        window.axios.get(`/api/documents/${id}`).then((response) => setDocument(response.data?.data));
    }, [id]);

    return (
        <MainLayout title="Détails du document" subtitle="Prévisualisation et informations complètes">
            <Head title="Document" />
            <PageContainer>
                {!document ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <PreviewFile fileUrl={document.fichier ? `/storage/${document.fichier}` : null} type={document.type} title={document.titre} />
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">{document.titre}</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div><dt className="text-gray-500">Type</dt><dd className="font-medium text-gray-800">{document.type ?? '-'}</dd></div>
                                <div><dt className="text-gray-500">Catégorie</dt><dd className="font-medium text-gray-800">{document.categorie ?? '-'}</dd></div>
                                <div><dt className="text-gray-500">Uploadé par</dt><dd className="font-medium text-gray-800">{document.uploaded_by ?? '-'}</dd></div>
                                <div><dt className="text-gray-500">Date d'ajout</dt><dd className="font-medium text-gray-800">{new Date(document.created_at).toLocaleString('fr-FR')}</dd></div>
                                <div><dt className="text-gray-500">Description</dt><dd className="font-medium text-gray-800">{document.description ?? '-'}</dd></div>
                            </dl>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <a href={`/storage/${document.fichier}`} download><Button>Télécharger</Button></a>
                                <Link href={`/documents/${document.id}/edit`}><Button variant="secondary">Modifier</Button></Link>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

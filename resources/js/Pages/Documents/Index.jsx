import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, FileImage, FileArchive, Plus, Download, Eye, Pencil, Trash2 } from '@/Components/Icons';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import DataTable from '@/Components/crud/DataTable';
import ConfirmDialog from '@/Components/crud/ConfirmDialog';

function iconForType(type) {
    const value = (type ?? '').toLowerCase();
    if (value.includes('pdf')) return <FileText size={16} className="text-red-500" />;
    if (value.includes('image') || value.includes('jpg') || value.includes('png')) return <FileImage size={16} className="text-indigo-500" />;
    return <FileArchive size={16} className="text-gray-500" />;
}

export default function Index() {
    const { props } = usePage();
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadDocuments = async () => {
        setLoading(true);
        const response = await window.axios.get('/api/documents');
        setItems(Array.isArray(response.data?.data?.data) ? response.data.data.data : []);
        setLoading(false);
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const filtered = useMemo(() => {
        return items.filter((doc) => {
            const matchesSearch = !query || doc.titre?.toLowerCase().includes(query.toLowerCase()) || doc.description?.toLowerCase().includes(query.toLowerCase());
            const matchesType = !type || (doc.type ?? '').toLowerCase() === type.toLowerCase();
            return matchesSearch && matchesType;
        });
    }, [items, query, type]);

    const deleteDocument = async () => {
        if (!deleteTarget) return;
        await window.axios.delete(`/api/documents/${deleteTarget.id}`);
        setDeleteTarget(null);
        loadDocuments();
    };

    const columns = [
        { key: 'titre', label: 'Titre', render: (row) => <div className="flex items-center gap-2 font-medium text-gray-900">{iconForType(row.type)}<span>{row.titre}</span></div> },
        { key: 'type', label: 'Type', render: (row) => (row.type ?? '-').toUpperCase() },
        { key: 'categorie', label: 'Catégorie', render: (row) => row.categorie ?? '-' },
        { key: 'taille', label: 'Taille', render: (row) => row.file_size ?? '-' },
        { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString('fr-FR') },
        { key: 'uploaded_by', label: 'Uploadé par', render: (row) => row.uploaded_by ?? props.auth?.user?.name ?? '-' },
    ];

    return (
        <MainLayout title="Documents" subtitle="Centralisez tous les fichiers de l'église" actionLabel="Ajouter document" onAction={() => router.visit('/documents/create')}>
            <Head title="Documents" />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 gap-2">
                            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un document..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                            <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                <option value="">Tous types</option>
                                <option value="pdf">PDF</option>
                                <option value="image">Image</option>
                                <option value="word">Word</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>
                        <Link href="/documents/create"><Button><Plus size={16} /> Ajouter document</Button></Link>
                    </div>

                    {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                        <DataTable
                            columns={columns}
                            data={filtered}
                            emptyTitle="Aucun document"
                            emptyDescription="Ajoutez votre premier document pour commencer."
                            renderActions={(row) => (
                                <div className="flex justify-end gap-2">
                                    <Link href={`/documents/${row.id}`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Eye size={14} /></Link>
                                    <a href={`/api/documents/${row.id}/download`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Download size={14} /></a>
                                    <Link href={`/documents/${row.id}/edit`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#1a56a0]"><Pencil size={14} /></Link>
                                    <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-lg border border-red-200 p-2 text-red-600"><Trash2 size={14} /></button>
                                </div>
                            )}
                        />
                    )}
                </div>

                <ConfirmDialog
                    open={Boolean(deleteTarget)}
                    title="Supprimer ce document ?"
                    description={deleteTarget ? `Le document "${deleteTarget.titre}" sera supprimé définitivement.` : ''}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={deleteDocument}
                />
            </PageContainer>
        </MainLayout>
    );
}

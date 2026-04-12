import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';

const Row = ({ label, value }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
);

export default function ComptabiliteShow({ id }) {
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        axios.get(`/api/comptabilites/${id}`).then(({ data }) => setTransaction(data.data));
    }, [id]);

    return (
        <MainLayout title="Détails transaction" subtitle="Informations de l'opération comptable">
            <Head title="Détail transaction" />
            <PageContainer>
                {!transaction ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Transaction #{transaction.id}</h2>
                            <div className="flex gap-2">
                                <Link href={`/comptabilite/${id}/edit`}><Button variant="secondary">Modifier</Button></Link>
                                <Link href="/comptabilite"><Button>Retour liste</Button></Link>
                            </div>
                        </div>
                        <div>
                            {transaction.type === 'autre' ? <Badge variant="danger">Sortie</Badge> : <Badge variant="success">Entrée</Badge>}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Row label="Catégorie" value={transaction.type} />
                            <Row label="Montant" value={`${Number(transaction.montant).toLocaleString()} FCFA`} />
                            <Row label="Date" value={transaction.date_operation} />
                            <Row label="Description" value={transaction.description} />
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';

const Row = ({ label, value }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
);

export default function VisiteursShow({ id }) {
    const [visiteur, setVisiteur] = useState(null);

    useEffect(() => {
        axios.get(`/api/visiteurs/${id}`).then(({ data }) => setVisiteur(data.data));
    }, [id]);

    return (
        <MainLayout title="Détail visiteur" subtitle="Fiche individuelle visiteur">
            <Head title="Détail visiteur" />
            <PageContainer>
                {!visiteur ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">{visiteur.nom} {visiteur.prenom}</h2>
                            <div className="flex gap-2">
                                <Link href={`/visiteurs/${id}/edit`}><Button variant="secondary">Modifier</Button></Link>
                                <Link href="/visiteurs"><Button>Retour liste</Button></Link>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Row label="Téléphone" value={visiteur.telephone} />
                            <Row label="Date de visite" value={visiteur.date_visite} />
                            <Row label="Invité par / Motif" value={visiteur.motif_visite} />
                            <Row label="Commentaire" value={visiteur.commentaire} />
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

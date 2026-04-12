import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import ProgrammesForm from '@/Pages/Programmes/Form';

export default function Edit() {
    const { url } = usePage();
    const id = url.split('/')[2];
    const { data, setData } = useForm({
        nom: '',
        date_debut: '',
        date_fin: '',
        heure: '',
        lieu: '',
        description: '',
        statut: 'actif',
    });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        window.axios.get(`/api/programmes/${id}`).then((response) => {
            const programme = response.data?.data;
            setData({
                nom: programme.nom ?? '',
                date_debut: programme.date_debut ?? '',
                date_fin: programme.date_fin ?? '',
                heure: programme.heure ?? '',
                lieu: programme.lieu ?? '',
                description: programme.description ?? '',
                statut: programme.statut ?? 'actif',
            });
            setLoading(false);
        });
    }, [id]);

    const submit = async (event) => {
        event.preventDefault();
        const nextErrors = {};

        if (!data.nom) nextErrors.nom = 'Le nom est requis.';
        if (!data.date_debut) nextErrors.date_debut = 'La date de début est requise.';
        if (!data.date_fin) nextErrors.date_fin = 'La date de fin est requise.';
        if (data.date_debut && data.date_fin && new Date(data.date_fin) < new Date(data.date_debut)) {
            nextErrors.date_range = 'La date de fin doit être supérieure ou égale à la date de début.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setProcessing(true);

        try {
            await window.axios.put(`/api/programmes/${id}`, data);
            window.location.href = `/programmes/${id}`;
        } catch (error) {
            setErrors(error.response?.data?.errors ?? { nom: 'Une erreur est survenue.' });
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Modifier le programme" subtitle="Mettez à jour les informations de prière">
            <Head title="Modifier programme" />
            <PageContainer>
                {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <ProgrammesForm values={data} setValues={setData} errors={errors} onSubmit={submit} processing={processing} submitLabel="Enregistrer les modifications" />
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

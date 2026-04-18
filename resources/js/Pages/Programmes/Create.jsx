import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import ProgrammesForm from '@/Pages/Programmes/Form';

export default function Create() {
    const { data, setData } = useForm({
        nom: '',
        date_debut: '',
        date_fin: '',
        type: '',
        heure: '',
        lieu: '',
        description: '',
        statut: 'actif',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const submit = async (event) => {
        event.preventDefault();
        const nextErrors = {};

        if (!data.nom) nextErrors.nom = 'Le nom est requis.';
        if (!data.date_debut) nextErrors.date_debut = 'La date de début est requise.';
        if (!data.type) nextErrors.type = 'Le type est requis.';
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
            await window.axios.post('/api/programmes', data);
            window.location.href = '/programmes';
        } catch (error) {
            setErrors(error.response?.data?.errors ?? { nom: 'Une erreur est survenue.' });
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Créer un événement" subtitle="Ajoutez un événement sans contrainte de participants">
            <Head title="Créer événement" />
            <PageContainer>
                <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <ProgrammesForm values={data} setValues={setData} errors={errors} onSubmit={submit} processing={processing} submitLabel="Créer l'événement" />
                </div>
            </PageContainer>
        </MainLayout>
    );
}

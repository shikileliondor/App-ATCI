import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import CultesForm from '@/Pages/Cultes/Form';

const defaultValues = {
    titre: '',
    theme: '',
    date_culte: '',
    heure: '',
    lieu: '',
    pasteur: '',
    observations: '',
    hommes_adultes: 0,
    femmes_adultes: 0,
    jeunes_hommes: 0,
    jeunes_filles: 0,
    enfants: 0,
    visiteurs: 0,
};

export default function Create() {
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await window.axios.post('/api/cultes', values);
            router.visit('/cultes');
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Nouveau culte" subtitle="Planifiez un nouveau culte">
            <Head title="Créer culte" />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <CultesForm values={values} setValues={setValues} errors={errors} onSubmit={submit} processing={processing} />
                </div>
            </PageContainer>
        </MainLayout>
    );
}

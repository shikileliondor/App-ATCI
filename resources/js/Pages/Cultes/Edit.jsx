import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import CultesForm from '@/Pages/Cultes/Form';

export default function Edit() {
    const { url } = usePage();
    const id = url.split('/')[2];
    const [values, setValues] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        window.axios.get(`/api/cultes/${id}`).then((response) => {
            const culte = response.data?.data;
            setValues({
                theme: culte.theme ?? '',
                date_culte: culte.date_culte ?? '',
                heure: culte.heure ?? '',
                lieu: culte.lieu ?? '',
                observations: culte.observations ?? '',
                hommes_adultes: culte.hommes_adultes ?? 0,
                femmes_adultes: culte.femmes_adultes ?? 0,
                jeunes_hommes: culte.jeunes_hommes ?? 0,
                jeunes_filles: culte.jeunes_filles ?? 0,
                enfants: culte.enfants ?? 0,
                visiteurs: culte.visiteurs ?? 0,
            });
        });
    }, [id]);

    const submit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await window.axios.put(`/api/cultes/${id}`, values);
            router.visit('/cultes');
        } catch (error) {
            setErrors(error.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <MainLayout title="Modifier culte" subtitle="Mettez à jour les informations du culte">
            <Head title="Modifier culte" />
            <PageContainer>
                {!values ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <CultesForm values={values} setValues={setValues} errors={errors} onSubmit={submit} processing={processing} />
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}

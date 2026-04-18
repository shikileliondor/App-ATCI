import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';

export default function EvenementsIndex() {
    return (
        <MainLayout title="Événements" subtitle="Planifiez et suivez les activités de l'église">
            <Head title="Événements" />

            <PageContainer>
                <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]">
                    <h2 className="text-xl font-semibold text-gray-900">Module Événements</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Cette section centralise les événements de l'église (cultes spéciaux, conférences, retraites, etc.).
                    </p>
                </section>
            </PageContainer>
        </MainLayout>
    );
}

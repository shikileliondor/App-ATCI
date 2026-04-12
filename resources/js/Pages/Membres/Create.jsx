import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';

function Card({ children, className = '' }) {
    return <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        email: '',
        telephone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/membres');
    };

    return (
        <MainLayout title="Ajouter membre" subtitle="Enregistrez un nouveau membre">
            <Head title="Ajouter membre" />

            <PageContainer>
                <Card className="mx-auto w-full max-w-3xl">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Nouveau membre</h2>
                        <p className="text-sm text-gray-500">Complétez les informations ci-dessous.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="nom" className="mb-1.5 block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                id="nom"
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]"
                                placeholder="Ex: Marie Dupont"
                            />
                            {errors.nom ? <p className="mt-1.5 text-sm text-red-600">{errors.nom}</p> : null}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]"
                                    placeholder="email@exemple.com"
                                />
                                {errors.email ? <p className="mt-1.5 text-sm text-red-600">{errors.email}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="telephone" className="mb-1.5 block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    id="telephone"
                                    type="text"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]"
                                    placeholder="Ex: +33 6 12 34 56 78"
                                />
                                {errors.telephone ? <p className="mt-1.5 text-sm text-red-600">{errors.telephone}</p> : null}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                            <Link href="/membres" className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#174b8a] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Enregistrement...' : 'Créer le membre'}
                            </button>
                        </div>
                    </form>
                </Card>
            </PageContainer>
        </MainLayout>
    );
}

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';

function Card({ children, className = '' }) {
    return <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export default function Index({ membres }) {
    const { props } = usePage();
    const [deletingId, setDeletingId] = useState(null);

    const membresList = useMemo(() => {
        const source = membres;

        if (Array.isArray(source)) {
            return source;
        }

        if (Array.isArray(source?.data)) {
            return source.data;
        }

        return [];
    }, [membres]);

    const successMessage = props.flash?.success ?? props.message;

    const handleDelete = (membre) => {
        if (!window.confirm(`Supprimer le membre "${membre.nom}" ? Cette action est irréversible.`)) {
            return;
        }

        router.delete(`/membres/${membre.id}`, {
            preserveScroll: true,
            onStart: () => setDeletingId(membre.id),
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <MainLayout title="Membres" subtitle="Gérez les membres de votre communauté" actionLabel="Ajouter membre" onAction={() => router.visit('/membres/create')}>
            <Head title="Membres" />

            <PageContainer>
                {successMessage ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>
                ) : null}

                <Card className="overflow-hidden">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Liste des membres</h2>
                            <p className="text-sm text-gray-500">{membresList.length} membre(s) enregistré(s).</p>
                        </div>
                        <Link
                            href="/membres/create"
                            className="inline-flex items-center justify-center rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#174b8a]"
                        >
                            Ajouter membre
                        </Link>
                    </div>

                    {membresList.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                            <p className="text-base font-medium text-gray-800">Aucun membre pour le moment</p>
                            <p className="mt-1 text-sm text-gray-500">Commencez par ajouter votre premier membre.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-4 py-3 font-medium">Nom complet</th>
                                        <th className="px-4 py-3 font-medium">Sexe</th>
                                        <th className="px-4 py-3 font-medium">Naissance</th>
                                        <th className="px-4 py-3 font-medium">Téléphone</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Département</th>
                                        <th className="px-4 py-3 font-medium">Comité</th>
                                        <th className="px-4 py-3 font-medium">Adresse</th>
                                        <th className="px-4 py-3 font-medium">Baptisé</th>
                                        <th className="px-4 py-3 font-medium">Date baptême</th>
                                        <th className="px-4 py-3 font-medium">Situation</th>
                                        <th className="px-4 py-3 font-medium">Profession</th>
                                        <th className="px-4 py-3 font-medium">Fonction</th>
                                        <th className="px-4 py-3 font-medium">Statut</th>
                                        <th className="px-4 py-3 font-medium">Inscription</th>
                                        <th className="px-4 py-3 font-medium">Observations</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {membresList.map((membre) => (
                                        <tr key={membre.id} className="transition hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{`${membre.nom} ${membre.prenom ?? ''}`.trim()}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.sexe ?? '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.date_naissance ?? '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.telephone || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.email || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.departement?.nom || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.comite?.nom || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.adresse || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.est_baptise ? 'Oui' : 'Non'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.date_bapteme || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.situation_matrimoniale || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.profession || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.fonction_eglise || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.statut || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.date_inscription || '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{membre.observations || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/membres/${membre.id}/edit`}
                                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#1a56a0] hover:text-[#1a56a0]"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(membre)}
                                                        disabled={deletingId === membre.id}
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {deletingId === membre.id ? 'Suppression...' : 'Supprimer'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {Array.isArray(membres?.links) && membres.links.length > 0 ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {membres.links.map((link, index) => (
                                <button
                                    type="button"
                                    key={`${link.label}-${index}`}
                                    disabled={!link.url || link.active}
                                    onClick={() => link.url && router.visit(link.url)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-[#1a56a0] text-white'
                                            : 'border border-gray-300 text-gray-700 hover:border-[#1a56a0] hover:text-[#1a56a0]'
                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    ) : null}
                </Card>
            </PageContainer>
        </MainLayout>
    );
}

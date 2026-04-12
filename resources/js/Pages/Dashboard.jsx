import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const stats = [
    { label: 'Total membres', value: '1 240', trend: '+12 ce mois' },
    { label: 'Hommes', value: '520', trend: '+5.3%' },
    { label: 'Femmes', value: '610', trend: '+4.1%' },
    { label: 'Jeunesse', value: '310', trend: '+9.8%' },
    { label: 'Visiteurs', value: '87', trend: '+16 nouveaux' },
    { label: 'Comptabilité du mois', value: '6 450 000 FCFA', trend: '+11%' },
    { label: 'Cultes enregistrés', value: '18', trend: '3 cette semaine' },
    { label: 'Documents générés', value: '72', trend: '14 en attente' },
];

const memberGrowth = [110, 128, 144, 170, 212, 242];
const breakdown = [38, 44, 36, 28];

const recentMembers = [
    { name: 'Adama Koné', department: 'Jeunesse', date: '10/04/2026' },
    { name: 'Mariam Traoré', department: 'Louange', date: '09/04/2026' },
    { name: 'Judith Kouassi', department: 'Intercession', date: '08/04/2026' },
    { name: 'Daniel Nguessan', department: 'Hospitalité', date: '06/04/2026' },
];

const recentAccounting = [
    { label: 'Dîmes dominicales', amount: '+1 250 000 FCFA', type: 'Entrée' },
    { label: 'Aide sociale', amount: '-180 000 FCFA', type: 'Sortie' },
    { label: 'Offrandes mission', amount: '+420 000 FCFA', type: 'Entrée' },
    { label: 'Achat sono', amount: '-950 000 FCFA', type: 'Sortie' },
];

const recentServices = [
    { name: 'Culte dominical', attendance: 420, souls: 12 },
    { name: 'Veillée de prière', attendance: 210, souls: 5 },
    { name: 'Réunion jeunesse', attendance: 168, souls: 7 },
];

function Card({ children }) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{children}</div>;
}

export default function Dashboard() {
    return (
        <MainLayout
            title="Tableau de bord"
            subtitle="Vue générale de l'activité de l'église"
            actionLabel="Nouveau membre"
            onAction={() => {}}
        >
            <Head title="Tableau de bord" />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="mt-2 text-sm font-medium text-emerald-600">↗ {stat.trend}</p>
                    </Card>
                ))}
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-5">
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">Évolution des membres</h2>
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">6 derniers mois</span>
                    </div>

                    <div className="flex h-64 items-end gap-3 rounded-xl bg-slate-50 px-3 pb-4 pt-6">
                        {memberGrowth.map((point, index) => (
                            <div key={point} className="flex flex-1 flex-col items-center justify-end gap-2">
                                <div
                                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400"
                                    style={{ height: `${(point / 260) * 180}px` }}
                                />
                                <span className="text-xs text-slate-500">{['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'][index]}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">Répartition</h2>
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">Membres actifs</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Hommes', value: breakdown[0], color: 'bg-blue-600' },
                            { label: 'Femmes', value: breakdown[1], color: 'bg-indigo-500' },
                            { label: 'Jeunesse', value: breakdown[2], color: 'bg-cyan-500' },
                            { label: 'Enfants', value: breakdown[3], color: 'bg-sky-400' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700">{item.label}</span>
                                    <span className="text-slate-500">{item.value}%</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-slate-100">
                                    <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-3">
                <Card>
                    <h2 className="mb-4 text-base font-semibold text-slate-900">Derniers membres ajoutés</h2>
                    <div className="space-y-3">
                        {recentMembers.map((member) => (
                            <div key={member.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                                    <p className="text-xs text-slate-500">{member.department}</p>
                                </div>
                                <span className="text-xs text-slate-500">{member.date}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="mb-4 text-base font-semibold text-slate-900">Dernières opérations comptabilité</h2>
                    <div className="space-y-3">
                        {recentAccounting.map((entry) => (
                            <div key={entry.label} className="rounded-xl border border-slate-100 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-slate-800">{entry.label}</p>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                            entry.type === 'Entrée' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                        }`}
                                    >
                                        {entry.type}
                                    </span>
                                </div>
                                <p
                                    className={`mt-1 text-sm font-semibold ${
                                        entry.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600'
                                    }`}
                                >
                                    {entry.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="mb-4 text-base font-semibold text-slate-900">Derniers cultes</h2>
                    <div className="space-y-3">
                        {recentServices.map((service) => (
                            <div key={service.name} className="rounded-xl bg-slate-50 p-3">
                                <p className="text-sm font-semibold text-slate-800">{service.name}</p>
                                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                    <span>Participants: {service.attendance}</span>
                                    <span>Décisions: {service.souls}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </MainLayout>
    );
}

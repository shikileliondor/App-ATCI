import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import Badge from '@/Components/ui/Badge';
import AppDialog from '@/Components/ui/Dialog';
import { Avatar, AvatarFallback } from '@/Components/ui/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/Tabs';
import { DropdownMenu, DropdownMenuItem } from '@/Components/ui/DropdownMenu';

function Card({ children, className = '' }) {
    return <div className={`rounded-3xl border border-white/60 bg-white/85 p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur ${className}`}>{children}</div>;
}

function Dot({ color }) {
    return <span className={`inline-flex h-2.5 w-2.5 rounded-full ${color}`} />;
}

export default function Dashboard({
    kpiCards = [],
    attendance = [],
    months = [],
    finances = [],
    financeLabels = [],
    members = [],
    accounting = [],
    services = [],
    documentsCount = 0,
}) {
    const [open, setOpen] = useState(false);

    const maxAttendance = useMemo(() => Math.max(1, ...attendance), [attendance]);

    const donutStyle = useMemo(() => ({
        background: 'conic-gradient(#2563eb 0 38%, #8b5cf6 38% 67%, #d1d5db 67% 100%)',
    }), []);

    return (
        <MainLayout title="Analytics" subtitle="Vue détaillée de votre situation financière et communautaire" actionLabel="Nouveau widget" onAction={() => setOpen(true)}>
            <Head title="Tableau de bord" />

            <PageContainer>
                <section className="rounded-3xl border border-white/70 bg-gradient-to-br from-[#f8f9ff] via-white to-[#f5f7ff] p-5 shadow-[0_30px_80px_-40px_rgba(30,64,175,0.35)] sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Vue mensuelle</p>
                            <h2 className="text-xl font-semibold text-gray-900">Tableau de bord principal</h2>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline">Données réelles</Badge>
                            <Badge variant="outline">USD/FCFA</Badge>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {kpiCards.map((stat) => (
                            <Card key={stat.label} className="rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</p>
                                <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                                <p className={`mt-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>{stat.trend}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Évolution des membres</h3>
                                <p className="text-sm text-gray-500">Comparaison sur 12 mois</p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                                <Dot color="bg-blue-600" /> Cette année
                            </div>
                        </div>
                        <div className="flex h-72 items-end gap-2 overflow-x-auto rounded-2xl bg-slate-50 px-3 pb-4 pt-6">
                            {attendance.map((point, index) => (
                                <div key={months[index] ?? index} className="flex min-w-[48px] flex-1 flex-col items-center gap-2">
                                    <div className="w-full rounded-t-xl bg-gradient-to-t from-blue-500 to-indigo-300 shadow-sm" style={{ height: `${(point / maxAttendance) * 190}px` }} />
                                    <span className="text-[11px] text-gray-500">{months[index]}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Statistiques</h3>
                            <Badge variant="outline">Dépenses</Badge>
                        </div>

                        <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-4">
                            <div className="relative grid h-44 w-44 place-items-center rounded-full" style={donutStyle}>
                                <div className="grid h-28 w-28 place-items-center rounded-full bg-white shadow-inner">
                                    <div className="text-center">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">Documents</p>
                                        <p className="text-xl font-semibold text-gray-900">{documentsCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 grid w-full grid-cols-3 gap-2 text-xs">
                                <div className="rounded-xl bg-white p-2 text-center"><Dot color="bg-blue-600" /> Données</div>
                                <div className="rounded-xl bg-white p-2 text-center"><Dot color="bg-violet-500" /> En direct</div>
                                <div className="rounded-xl bg-white p-2 text-center"><Dot color="bg-gray-300" /> Dashboard</div>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Comparaison budget & dépenses</h3>
                            <Badge variant="outline">7 derniers jours</Badge>
                        </div>
                        <div className="grid grid-cols-7 gap-3 rounded-2xl bg-gray-50 p-4">
                            {finances.map((value, index) => (
                                <div key={financeLabels[index] ?? index} className="flex flex-col items-center gap-2">
                                    <div className="flex h-32 w-full items-end rounded-xl bg-white p-2">
                                        <div className="w-full rounded-lg bg-gradient-to-t from-violet-500 to-blue-400" style={{ height: `${value}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-500">{financeLabels[index]}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-base font-semibold text-gray-900">Actions rapides</h3>
                        <div className="mt-3 space-y-2">
                            {["Ajouter membre", "Enregistrer offrande", "Créer programme", "Exporter rapport"].map((item) => (
                                <button key={item} type="button" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-blue-200 hover:text-blue-700">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </Card>
                </section>

                <section>
                    <Tabs defaultValue="membres">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <TabsList>
                                <TabsTrigger value="membres">Membres</TabsTrigger>
                                <TabsTrigger value="comptabilite">Comptabilité</TabsTrigger>
                                <TabsTrigger value="cultes">Cultes</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>
                            <div className="flex w-full gap-2 md:w-auto">
                                <Input placeholder="Rechercher..." className="md:w-56" />
                                <Select options={[{ value: 'all', label: 'Tous les départements' }]} />
                            </div>
                        </div>

                        <TabsContent value="membres">
                            <Card>
                                <h3 className="mb-4 text-base font-medium">Derniers membres ajoutés</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-xs uppercase text-gray-500">
                                                <th className="pb-3">Membre</th><th className="pb-3">Téléphone</th><th className="pb-3">Département</th><th className="pb-3">Comité</th><th className="pb-3">Statut</th><th className="pb-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {members.map((member) => (
                                                <tr key={member.name} className="border-b last:border-0">
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{member.initials}</AvatarFallback></Avatar><span className="font-medium text-gray-900">{member.name}</span></div>
                                                    </td>
                                                    <td className="py-3 text-gray-600">{member.phone}</td>
                                                    <td className="py-3 text-gray-600">{member.department}</td>
                                                    <td className="py-3 text-gray-600">{member.committee}</td>
                                                    <td className="py-3"><Badge variant={member.status === 'Actif' ? 'success' : 'warning'}>{member.status}</Badge></td>
                                                    <td className="py-3 text-right">
                                                        <DropdownMenu trigger={<Button size="sm" variant="secondary">Actions</Button>}>
                                                            <DropdownMenuItem>Voir</DropdownMenuItem>
                                                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                            <DropdownMenuItem danger>Supprimer</DropdownMenuItem>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="comptabilite">
                            <Card>
                                <h3 className="mb-4 text-base font-medium">Dernières opérations comptables</h3>
                                <div className="space-y-3">
                                    {accounting.map((entry) => (
                                        <div key={`${entry.label}-${entry.amount}`} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{entry.label}</p>
                                                <p className="text-sm text-gray-500">Montant: {entry.amount}</p>
                                            </div>
                                            <Badge variant={entry.type === 'Sortie' ? 'danger' : 'success'}>{entry.type}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="cultes">
                            <Card>
                                <h3 className="mb-4 text-base font-medium">Derniers cultes enregistrés</h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {services.map((service) => (
                                        <div key={service.name} className="rounded-xl border border-gray-100 p-4">
                                            <p className="font-medium text-gray-900">{service.name}</p>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                <span>Hommes: {service.men}</span><span>Femmes: {service.women}</span><span>Jeunesse: {service.youth}</span><span>Enfants: {service.children}</span><span>Visiteurs: {service.visitors}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents">
                            <Card>
                                <h3 className="mb-4 text-base font-medium">Documents</h3>
                                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">{documentsCount} document(s) enregistré(s) dans la base.</div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
            </PageContainer>

            <AppDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Ajouter un membre"
                description="Formulaire rapide en 2 étapes pour enregistrer un nouveau membre."
            >
                <div className="space-y-3">
                    <Input placeholder="Nom complet" />
                    <Input placeholder="Téléphone" />
                    <Select options={[{ value: 'jeunesse', label: 'Jeunesse' }, { value: 'louange', label: 'Louange' }, { value: 'accueil', label: 'Accueil' }]} />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button>Enregistrer</Button>
                    </div>
                </div>
            </AppDialog>
        </MainLayout>
    );
}

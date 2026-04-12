import { useState } from 'react';
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

const stats = [
    { label: 'Total membres', value: '1 240', trend: '+12 ce mois', tone: 'text-green-600' },
    { label: 'Hommes', value: '520', trend: '41.9%', tone: 'text-blue-600' },
    { label: 'Femmes', value: '610', trend: '49.1%', tone: 'text-blue-600' },
    { label: 'Jeunesse', value: '310', trend: '+9.8%', tone: 'text-green-600' },
    { label: 'Enfants', value: '186', trend: '+4.2%', tone: 'text-green-600' },
    { label: 'Visiteurs', value: '87', trend: '+16 nouveaux', tone: 'text-amber-600' },
    { label: 'Comptabilité du mois', value: '6 450 000 FCFA', trend: '+11%', tone: 'text-green-600' },
    { label: 'Cultes enregistrés', value: '18', trend: '3 cette semaine', tone: 'text-blue-600' },
];

const growth = [110, 128, 144, 170, 212, 242];
const months = ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'];

const members = [
    { initials: 'AK', name: 'Adama Koné', phone: '+225 01 23 45 67 89', department: 'Jeunesse', committee: 'Communication', status: 'Actif' },
    { initials: 'MT', name: 'Mariam Traoré', phone: '+225 05 43 11 08 90', department: 'Louange', committee: 'Accueil', status: 'Nouveau' },
    { initials: 'JK', name: 'Judith Kouassi', phone: '+225 07 88 19 28 42', department: 'Intercession', committee: 'Prière', status: 'Actif' },
];

const accounting = [
    { label: 'Dîmes dominicales', amount: '1 250 000 FCFA', type: 'Dîme' },
    { label: 'Offrandes mission', amount: '420 000 FCFA', type: 'Offrande' },
    { label: 'Action sociale', amount: '180 000 FCFA', type: 'Sortie' },
];

const services = [
    { name: 'Culte dominical', men: 160, women: 220, youth: 60, children: 34, visitors: 14 },
    { name: 'Veillée de prière', men: 90, women: 95, youth: 25, children: 6, visitors: 7 },
];

function Card({ children, className = '' }) {
    return <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export default function Dashboard() {
    const [open, setOpen] = useState(false);

    return (
        <MainLayout title="Tableau de bord" subtitle="Aperçu global de l'église" actionLabel="Nouveau membre" onAction={() => setOpen(true)}>
            <Head title="Tableau de bord" />

            <PageContainer>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <p className="text-xs uppercase text-gray-500">{stat.label}</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p className={`mt-1 text-sm font-medium ${stat.tone}`}>{stat.trend}</p>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-medium text-gray-900">Évolution des membres</h2>
                            <Badge variant="outline">6 derniers mois</Badge>
                        </div>
                        <div className="flex h-64 items-end gap-3 rounded-xl bg-gray-50 px-3 pb-4 pt-6">
                            {growth.map((point, index) => (
                                <div key={months[index]} className="flex flex-1 flex-col items-center gap-2">
                                    <div className="w-full rounded-t-md bg-[#1a56a0]" style={{ height: `${(point / 260) * 180}px` }} />
                                    <span className="text-xs text-gray-500">{months[index]}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-base font-medium text-gray-900">Répartition</h2>
                        <div className="mt-4 space-y-4">
                            {[['Hommes', 42], ['Femmes', 49], ['Jeunesse', 25], ['Enfants', 15]].map(([label, value]) => (
                                <div key={label}>
                                    <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div>
                                    <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-[#1a56a0]" style={{ width: `${value}%` }} /></div>
                                </div>
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
                                <Select options={[{ value: 'all', label: 'Tous les départements' }, { value: 'jeunesse', label: 'Jeunesse' }, { value: 'louange', label: 'Louange' }]} />
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
                                        <div key={entry.label} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
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
                                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">Glissez-déposez vos fichiers ici ou cliquez pour uploader.</div>
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

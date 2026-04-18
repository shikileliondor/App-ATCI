import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';

function Card({ title, subtitle, children, right }) {
    return (
        <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
                </div>
                {right}
            </div>
            {children}
        </section>
    );
}

export default function CommunicationIndex({ departements = [], comites = [], membres = [], templates = [], history = [] }) {
    const { flash } = usePage().props;
    const [editingTemplateId, setEditingTemplateId] = useState(null);

    const sendForm = useForm({
        recipient_mode: 'all',
        departement_id: '',
        comite_id: '',
        member_ids: [],
        template_id: '',
        message: '',
    });

    const templateForm = useForm({
        name: '',
        content: '',
    });

    const recipientCount = useMemo(() => {
        if (sendForm.data.recipient_mode === 'all') return membres.length;
        if (sendForm.data.recipient_mode === 'departement') return membres.filter((m) => String(m.departement_id || '') === String(sendForm.data.departement_id)).length;
        if (sendForm.data.recipient_mode === 'comite') return membres.filter((m) => String(m.comite_id || '') === String(sendForm.data.comite_id)).length;

        return sendForm.data.member_ids.length;
    }, [membres, sendForm.data]);

    const onChangeTemplateSelection = (id) => {
        sendForm.setData('template_id', id);
        const selected = templates.find((template) => String(template.id) === String(id));
        if (selected) {
            sendForm.setData('message', selected.content);
        }
    };

    const toggleMember = (memberId) => {
        const exists = sendForm.data.member_ids.includes(memberId);
        sendForm.setData('member_ids', exists ? sendForm.data.member_ids.filter((id) => id !== memberId) : [...sendForm.data.member_ids, memberId]);
    };

    const submitMessage = (event) => {
        event.preventDefault();
        sendForm.post('/communication/send', { preserveScroll: true });
    };

    const submitTemplate = (event) => {
        event.preventDefault();

        if (editingTemplateId) {
            templateForm.put(`/communication/templates/${editingTemplateId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    templateForm.reset();
                    setEditingTemplateId(null);
                },
            });
            return;
        }

        templateForm.post('/communication/templates', {
            preserveScroll: true,
            onSuccess: () => templateForm.reset(),
        });
    };

    const onEditTemplate = (template) => {
        setEditingTemplateId(template.id);
        templateForm.setData({ name: template.name, content: template.content });
    };

    return (
        <MainLayout title="Communication" subtitle="Diffusez vos annonces et gérez vos templates SMS">
            <Head title="Communication" />

            <PageContainer>
                {flash?.success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.success}</div> : null}
                {flash?.error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{flash.error}</div> : null}

                <div className="grid gap-4 xl:grid-cols-3">
                    <Card title="Envoyer un message" subtitle="Canal SMS prêt pour API externe" right={<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{recipientCount} destinataire(s)</span>}>
                        <form onSubmit={submitMessage} className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Cible</label>
                            <select value={sendForm.data.recipient_mode} onChange={(event) => sendForm.setData('recipient_mode', event.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                <option value="all">Tous les membres</option>
                                <option value="departement">Par département</option>
                                <option value="comite">Par comité</option>
                                <option value="custom">Sélection personnalisée</option>
                            </select>

                            {sendForm.data.recipient_mode === 'departement' ? (
                                <select value={sendForm.data.departement_id} onChange={(event) => sendForm.setData('departement_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                    <option value="">Choisir un département</option>
                                    {departements.map((departement) => <option key={departement.id} value={departement.id}>{departement.nom}</option>)}
                                </select>
                            ) : null}

                            {sendForm.data.recipient_mode === 'comite' ? (
                                <select value={sendForm.data.comite_id} onChange={(event) => sendForm.setData('comite_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                    <option value="">Choisir un comité</option>
                                    {comites.map((comite) => <option key={comite.id} value={comite.id}>{comite.nom}</option>)}
                                </select>
                            ) : null}

                            {sendForm.data.recipient_mode === 'custom' ? (
                                <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-gray-200 p-2">
                                    {membres.map((membre) => (
                                        <label key={membre.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                                            <input type="checkbox" checked={sendForm.data.member_ids.includes(membre.id)} onChange={() => toggleMember(membre.id)} />
                                            <span>{membre.nom} {membre.prenom}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            <select value={sendForm.data.template_id} onChange={(event) => onChangeTemplateSelection(event.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                                <option value="">Utiliser un template</option>
                                {templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                            </select>

                            <textarea value={sendForm.data.message} onChange={(event) => sendForm.setData('message', event.target.value)} rows={5} placeholder="Votre message..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                            {sendForm.errors.message ? <p className="text-xs text-rose-600">{sendForm.errors.message}</p> : null}

                            <button type="submit" disabled={sendForm.processing} className="w-full rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#164a88] disabled:opacity-60">
                                {sendForm.processing ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </form>
                    </Card>

                    <Card title="Templates de messages" subtitle="Créez, modifiez et supprimez vos modèles">
                        <form onSubmit={submitTemplate} className="space-y-3">
                            <input type="text" value={templateForm.data.name} onChange={(event) => templateForm.setData('name', event.target.value)} placeholder="Nom du template (ex: Rappel culte)" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                            <textarea value={templateForm.data.content} onChange={(event) => templateForm.setData('content', event.target.value)} rows={4} placeholder="Bonjour, nous vous rappelons le programme..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                            <div className="flex gap-2">
                                <button type="submit" className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white">{editingTemplateId ? 'Mettre à jour' : 'Créer template'}</button>
                                {editingTemplateId ? (
                                    <button type="button" onClick={() => { setEditingTemplateId(null); templateForm.reset(); }} className="rounded-xl border border-gray-200 px-3 py-2 text-sm">Annuler</button>
                                ) : null}
                            </div>
                        </form>

                        <div className="mt-4 space-y-2">
                            {templates.map((template) => (
                                <article key={template.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{template.name}</p>
                                            <p className="mt-1 text-sm text-gray-600">{template.content}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => onEditTemplate(template)} className="text-xs font-semibold text-blue-700">Modifier</button>
                                            <button type="button" onClick={() => router.delete(`/communication/templates/${template.id}`, { preserveScroll: true })} className="text-xs font-semibold text-rose-600">Supprimer</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                            {templates.length === 0 ? <p className="text-sm text-gray-500">Aucun template enregistré.</p> : null}
                        </div>
                    </Card>

                    <Card title="Historique des messages" subtitle="Suivi des envois SMS">
                        <div className="space-y-2">
                            {history.map((item) => (
                                <article key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
                                    <p className="font-medium text-gray-900">{item.content}</p>
                                    <p className="mt-1 text-gray-600">Date: {new Date(item.sent_at || item.created_at).toLocaleString('fr-FR')}</p>
                                    <p className="text-gray-600">Destinataires: {item.recipient_count}</p>
                                    <p className="text-gray-600">Statut: <span className={`font-semibold ${item.status === 'envoye' ? 'text-emerald-700' : 'text-amber-700'}`}>{item.status}</span></p>
                                </article>
                            ))}
                            {history.length === 0 ? <p className="text-sm text-gray-500">Aucun envoi pour le moment.</p> : null}
                        </div>
                    </Card>
                </div>
            </PageContainer>
        </MainLayout>
    );
}

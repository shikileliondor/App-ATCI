import { useEffect, useMemo, useState } from 'react';
import AppDialog from '@/Components/ui/Dialog';
import Input from '@/Components/ui/Input';
import Button from '@/Components/ui/Button';

const initialData = {
    date: '',
    hommes_adultes: 0,
    femmes_adultes: 0,
    jeunes_hommes: 0,
    jeunes_filles: 0,
    enfants: 0,
    visiteurs: 0,
};

const fields = [
    { key: 'hommes_adultes', label: 'Hommes adultes' },
    { key: 'femmes_adultes', label: 'Femmes adultes' },
    { key: 'jeunes_hommes', label: 'Jeunes hommes' },
    { key: 'jeunes_filles', label: 'Jeunes filles' },
    { key: 'enfants', label: 'Enfants' },
    { key: 'visiteurs', label: 'Visiteurs' },
];

export default function PresenceForm({ open, onClose, onSubmit, loading = false, initialValue = null }) {
    const [form, setForm] = useState(initialData);

    useEffect(() => {
        if (!open) return;

        if (initialValue) {
            setForm({
                date: initialValue.date ?? '',
                hommes_adultes: Number(initialValue.hommes_adultes ?? 0),
                femmes_adultes: Number(initialValue.femmes_adultes ?? 0),
                jeunes_hommes: Number(initialValue.jeunes_hommes ?? 0),
                jeunes_filles: Number(initialValue.jeunes_filles ?? 0),
                enfants: Number(initialValue.enfants ?? 0),
                visiteurs: Number(initialValue.visiteurs ?? 0),
            });
            return;
        }

        setForm(initialData);
    }, [open, initialValue]);

    const total = useMemo(() => fields.reduce((sum, field) => sum + Number(form[field.key] ?? 0), 0), [form]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            date: form.date,
            hommes_adultes: Number(form.hommes_adultes),
            femmes_adultes: Number(form.femmes_adultes),
            jeunes_hommes: Number(form.jeunes_hommes),
            jeunes_filles: Number(form.jeunes_filles),
            enfants: Number(form.enfants),
            visiteurs: Number(form.visiteurs),
        });
    };

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title={initialValue ? 'Modifier une présence' : 'Ajouter une présence'}
            description="Saisissez les statistiques détaillées pour une journée donnée."
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                    <Input
                        type="date"
                        value={form.date}
                        onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                        required
                    />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {fields.map((field) => (
                        <div key={field.key}>
                            <label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
                            <Input
                                type="number"
                                min={0}
                                value={form[field.key]}
                                onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: Math.max(0, Number(event.target.value || 0)) }))}
                                required
                            />
                        </div>
                    ))}
                </div>

                <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">Total participants: <span className="font-semibold">{total}</span></p>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose} type="button">Annuler</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'En cours...' : 'Enregistrer'}</Button>
                </div>
            </form>
        </AppDialog>
    );
}

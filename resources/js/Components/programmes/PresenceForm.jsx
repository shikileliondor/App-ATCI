import { useEffect, useState } from 'react';
import AppDialog from '@/Components/ui/Dialog';
import Input from '@/Components/ui/Input';
import Button from '@/Components/ui/Button';

const initialData = {
    date: '',
    nombre_participants: '',
};

export default function PresenceForm({ open, onClose, onSubmit, loading = false, initialValue = null }) {
    const [form, setForm] = useState(initialData);

    useEffect(() => {
        if (!open) return;

        if (initialValue) {
            setForm({
                date: initialValue.date ?? '',
                nombre_participants: String(initialValue.nombre_participants ?? ''),
            });
            return;
        }

        setForm(initialData);
    }, [open, initialValue]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            date: form.date,
            nombre_participants: Number(form.nombre_participants),
        });
    };

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title={initialValue ? 'Modifier une présence' : 'Ajouter une présence'}
            description="Saisissez les participants pour une journée donnée."
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

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nombre participants</label>
                    <Input
                        type="number"
                        min={0}
                        value={form.nombre_participants}
                        onChange={(event) => setForm((prev) => ({ ...prev, nombre_participants: event.target.value }))}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose} type="button">Annuler</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'En cours...' : 'Enregistrer'}</Button>
                </div>
            </form>
        </AppDialog>
    );
}

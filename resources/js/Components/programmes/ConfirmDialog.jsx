import Button from '@/Components/ui/Button';

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel}>Annuler</Button>
                    <Button variant="destructive" onClick={onConfirm}>Supprimer</Button>
                </div>
            </div>
        </div>
    );
}

import AppDialog from '@/Components/ui/Dialog';
import Button from '@/Components/ui/Button';

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm, loading = false }) {
    return (
        <AppDialog open={open} onClose={onCancel} title={title} description={description}>
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={onCancel}>
                    Annuler
                </Button>
                <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                    {loading ? 'Suppression...' : 'Confirmer'}
                </Button>
            </div>
        </AppDialog>
    );
}

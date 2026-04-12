import AppDialog from '@/Components/ui/Dialog';
import Button from '@/Components/ui/Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading = false }) {
    return (
        <AppDialog open={open} onClose={onClose} title={title} description={description}>
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Annuler
                </Button>
                <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                    {loading ? 'Suppression...' : 'Confirmer'}
                </Button>
            </div>
        </AppDialog>
    );
}

import Button from '@/Components/ui/Button';
import AppDialog from '@/Components/ui/Dialog';
import Input from '@/Components/ui/Input';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [open, setOpen] = useState(false);
    const passwordInput = useRef(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const close = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    const submit = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: close,
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-red-700">Suppression du compte</h2>
                <p className="mt-1 text-sm text-slate-500">Cette action supprime définitivement votre compte et vos données.</p>
            </header>

            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/80 p-4">
                <p className="text-sm text-red-700">Vous ne pourrez pas annuler cette action après confirmation.</p>
                <Button type="button" variant="destructive" className="mt-3" onClick={() => setOpen(true)}>Supprimer mon compte</Button>
            </div>

            <AppDialog
                open={open}
                onClose={close}
                title="Confirmer la suppression"
                description="Pour continuer, saisissez votre mot de passe actuel."
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="delete-password" className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
                        <Input
                            id="delete-password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        {errors.password ? <p className="mt-1 text-xs font-medium text-red-600">{errors.password}</p> : null}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={close}>Annuler</Button>
                        <Button type="submit" variant="destructive" disabled={processing}>{processing ? 'Suppression...' : 'Confirmer la suppression'}</Button>
                    </div>
                </form>
            </AppDialog>
        </section>
    );
}

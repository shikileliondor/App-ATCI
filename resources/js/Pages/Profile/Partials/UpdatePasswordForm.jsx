import Input from '@/Components/ui/Input';
import Button from '@/Components/ui/Button';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

export default function UpdatePasswordForm({ className = '' }) {
    const currentPasswordInput = useRef(null);
    const passwordInput = useRef(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }

                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-slate-900">Sécurité du compte</h2>
                <p className="mt-1 text-sm text-slate-500">Choisissez un mot de passe robuste pour protéger votre compte.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="current_password" className="mb-1 block text-sm font-medium text-slate-700">Mot de passe actuel</label>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        autoComplete="current-password"
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                    />
                    <FieldError message={errors.current_password} />
                </div>

                <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                    <Input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                    />
                    <FieldError message={errors.password} />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-slate-700">Confirmer le nouveau mot de passe</label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />
                    <FieldError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>{processing ? 'Mise à jour...' : 'Mettre à jour'}</Button>
                    {recentlySuccessful ? <span className="text-sm text-emerald-700">Mot de passe mis à jour.</span> : null}
                </div>
            </form>
        </section>
    );
}

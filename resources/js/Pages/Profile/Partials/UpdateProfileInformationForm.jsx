import Input from '@/Components/ui/Input';
import Button from '@/Components/ui/Button';
import { Link, useForm, usePage } from '@inertiajs/react';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-slate-900">Informations du profil</h2>
                <p className="mt-1 text-sm text-slate-500">Mettez à jour votre nom et votre adresse email.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        autoComplete="name"
                        required
                    />
                    <FieldError message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Adresse email</label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="username"
                        required
                    />
                    <FieldError message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <p>
                            Votre email n'est pas encore vérifié.
                            <Link href={route('verification.send')} method="post" as="button" className="ml-1 font-semibold underline">
                                Renvoyer le lien de vérification
                            </Link>
                        </p>
                        {status === 'verification-link-sent' ? <p className="mt-1 text-xs font-semibold">Un nouveau lien a été envoyé.</p> : null}
                    </div>
                ) : null}

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : 'Enregistrer'}</Button>
                    {recentlySuccessful ? <span className="text-sm text-emerald-700">Modifications enregistrées.</span> : null}
                </div>
            </form>
        </section>
    );
}

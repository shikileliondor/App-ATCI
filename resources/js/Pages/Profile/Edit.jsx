import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function ProfileCard({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <MainLayout title="Mon profil" subtitle="Gérez vos informations personnelles et la sécurité du compte.">
            <Head title="Mon profil" />

            <PageContainer className="space-y-4">
                <ProfileCard
                    title="Identité"
                    description="Vos informations visibles dans l'application."
                >
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </ProfileCard>

                <ProfileCard
                    title="Mot de passe"
                    description="Renforcez la sécurité de votre compte."
                >
                    <UpdatePasswordForm />
                </ProfileCard>

                <ProfileCard
                    title="Zone sensible"
                    description="Opérations critiques liées à votre compte."
                >
                    <DeleteUserForm />
                </ProfileCard>
            </PageContainer>
        </MainLayout>
    );
}

import { Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';
import FormInput from '@/Components/crud/FormInput';
import FileUpload from '@/Components/crud/FileUpload';

const typeOptions = [
    { value: 'certificat', label: 'Certificat' },
    { value: 'attestation', label: 'Attestation' },
    { value: 'autre', label: 'Autre' },
];
const categoryOptions = ['Administration', 'Finance', 'Ministère', 'Communication', 'Autre'];

export default function DocumentsForm({ values, setValues, errors = {}, onSubmit, processing, isEdit = false }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                    label="Titre"
                    value={values.titre}
                    onChange={(event) => setValues((current) => ({ ...current, titre: event.target.value }))}
                    error={errors.titre}
                    placeholder="Ex: Rapport de réunion"
                />

                <label className="space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Type</span>
                    <select
                        value={values.type}
                        onChange={(event) => setValues((current) => ({ ...current, type: event.target.value }))}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800"
                    >
                        <option value="">Sélectionner</option>
                        {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {errors.type ? <p className="text-xs text-red-600">{errors.type}</p> : null}
                </label>

                <label className="space-y-1.5">
                    <span className="text-sm font-medium text-gray-700">Catégorie</span>
                    <select
                        value={values.categorie}
                        onChange={(event) => setValues((current) => ({ ...current, categorie: event.target.value }))}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800"
                    >
                        <option value="">Sélectionner</option>
                        {categoryOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">Description</span>
                <textarea
                    value={values.description}
                    onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800"
                    placeholder="Description du document"
                />
                {errors.description ? <p className="text-xs text-red-600">{errors.description}</p> : null}
            </label>

            {!isEdit || values.fichier ? (
                <FileUpload file={values.fichier} onChange={(fichier) => setValues((current) => ({ ...current, fichier }))} error={errors.fichier} />
            ) : (
                <FileUpload file={null} onChange={(fichier) => setValues((current) => ({ ...current, fichier }))} error={errors.fichier} />
            )}

            <div className="flex justify-end gap-2">
                <Link href="/documents" className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700">Annuler</Link>
                <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer document'}</Button>
            </div>
        </form>
    );
}

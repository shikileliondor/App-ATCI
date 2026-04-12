export default function PreviewFile({ fileUrl, type, title = 'Prévisualisation' }) {
    if (!fileUrl) {
        return <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">Aucune prévisualisation disponible.</div>;
    }

    const normalized = (type ?? '').toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'image'].some((item) => normalized.includes(item));
    const isPdf = normalized.includes('pdf');

    if (isImage) {
        return <img src={fileUrl} alt={title} className="max-h-[420px] w-full rounded-xl border border-gray-200 object-contain" />;
    }

    if (isPdf) {
        return <iframe src={fileUrl} title={title} className="h-[540px] w-full rounded-xl border border-gray-200" />;
    }

    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
            Prévisualisation non disponible pour ce type de fichier. Utilisez le bouton téléchargement.
        </div>
    );
}

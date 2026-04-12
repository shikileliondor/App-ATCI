import { useMemo } from 'react';

export default function FileUpload({ label = 'Fichier', file, onChange, error }) {
    const helper = useMemo(() => {
        if (!file) {
            return 'PDF, Word ou image (max 10MB).';
        }

        return `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    }, [file]);

    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
            />
            <p className="text-xs text-gray-500">{helper}</p>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </label>
    );
}

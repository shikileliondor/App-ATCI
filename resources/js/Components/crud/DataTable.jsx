export default function DataTable({ columns, data, emptyTitle, emptyDescription, renderActions }) {
    return (
        <div className="overflow-x-auto">
            {data.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                    <p className="text-base font-medium text-gray-800">{emptyTitle}</p>
                    <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                            {columns.map((column) => (
                                <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>
                            ))}
                            {renderActions ? <th className="px-4 py-3 text-right font-medium">Actions</th> : null}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="transition hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={`${row.id}-${column.key}`} className="px-4 py-3 text-gray-700">
                                        {column.render ? column.render(row) : row[column.key] ?? '-'}
                                    </td>
                                ))}
                                {renderActions ? <td className="px-4 py-3">{renderActions(row)}</td> : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

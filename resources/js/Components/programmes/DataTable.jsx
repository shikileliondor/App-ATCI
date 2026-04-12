export default function DataTable({ columns, data, renderActions, emptyMessage = 'Aucune donnée.' }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    {column.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50/70">
                                {columns.map((column) => (
                                    <td key={`${row.id}-${column.key}`} className="px-4 py-3 text-gray-700">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                                <td className="px-4 py-3">{renderActions?.(row)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

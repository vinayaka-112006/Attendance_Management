export default function DataTable({ columns, rows, empty = "No records found" }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>{columns.map((column) => <th className="px-4 py-3" key={column.key}>{column.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows?.length ? rows.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/70">
                {columns.map((column) => <td className="px-4 py-3 text-slate-700 dark:text-slate-200" key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            )) : <tr><td className="px-4 py-6 text-center text-slate-500 dark:text-slate-400" colSpan={columns.length}>{empty}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createContext, useContext, useMemo, useState } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children }) {
    const [value, setValue] = useState(defaultValue);
    const ctx = useMemo(() => ({ value, setValue }), [value]);
    return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

export function TabsList({ children }) {
    return <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">{children}</div>;
}

export function TabsTrigger({ value, children }) {
    const ctx = useContext(TabsContext);
    const active = ctx?.value === value;
    return <button type="button" onClick={() => ctx?.setValue(value)} className={`rounded-md px-3 py-1.5 text-sm transition ${active ? 'bg-[#1a56a0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{children}</button>;
}

export function TabsContent({ value, children }) {
    const ctx = useContext(TabsContext);
    if (ctx?.value !== value) return null;
    return <div className="mt-4">{children}</div>;
}

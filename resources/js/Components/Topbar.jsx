export default function Topbar({ title, subtitle, actionLabel, onAction, onOpenSidebar, userName, userInitials }) {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenSidebar}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                        </svg>
                    </button>

                    <div>
                        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
                        <p className="text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onAction}
                        className="hidden rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex"
                    >
                        + {actionLabel}
                    </button>

                    <button
                        type="button"
                        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
                            <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
                        </svg>
                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
                    </button>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
                            {userInitials}
                        </span>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">{userName}</p>
                            <p className="text-xs text-slate-500">Administrateur</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

import Button from '@/Components/ui/Button';
import { Avatar, AvatarFallback } from '@/Components/ui/Avatar';

export default function Topbar({ title, subtitle, actionLabel, onAction, onOpenSidebar, userName, userInitials, branding }) {
    return (
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onOpenSidebar} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 lg:hidden">☰</button>
                    <div className="hidden items-center gap-2 rounded-xl border border-gray-100 bg-white px-2 py-1 shadow-sm sm:flex lg:hidden">
                        <img src={branding?.logoPath ?? '/images/church-logo.svg'} alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
                        <span className="max-w-28 truncate text-xs font-semibold text-gray-700">{branding?.churchName || 'ERP Église'}</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {actionLabel ? <Button className="hidden sm:inline-flex" onClick={onAction}>+ {actionLabel}</Button> : null}
                    <Avatar>
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500">Administrateur</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

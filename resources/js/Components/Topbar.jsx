import Button from '@/Components/ui/Button';
import { Avatar, AvatarFallback } from '@/Components/ui/Avatar';

export default function Topbar({ title, subtitle, actionLabel, onAction, onOpenSidebar, userName, userInitials }) {
    return (
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onOpenSidebar} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 lg:hidden">☰</button>
                    <div>
                        <h1 className="text-xl font-medium text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="hidden sm:inline-flex" onClick={onAction}>+ {actionLabel}</Button>
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

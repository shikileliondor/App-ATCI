import Button from '@/Components/ui/Button';
import { Avatar, AvatarFallback } from '@/Components/ui/Avatar';
import { Link } from '@inertiajs/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

function MenuIconProfile() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>;
}

function MenuIconSettings() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .35 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.35 1.7 1.7 0 0 0-1 1.55V22a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.35l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.35-1.87l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.35l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" /></svg>;
}

function MenuIconLogout() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 17 15 12 10 7" /><path d="M15 12H4" /><path d="M12 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" /></svg>;
}

export default function Topbar({ title, subtitle, actionLabel, onAction, onOpenSidebar, userName, userEmail, userInitials, branding }) {
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
                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-3 rounded-xl border border-transparent px-1.5 py-1 hover:border-gray-200 hover:bg-white">
                            <Avatar>
                                <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-medium text-gray-800">{userName}</p>
                                <p className="text-xs text-gray-500">Administrateur</p>
                            </div>
                            <span className="hidden text-gray-500 sm:inline">▾</span>
                        </MenuButton>

                        <MenuItems anchor="bottom end" className="z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 shadow-xl focus:outline-none">
                            <div className="border-b border-gray-100 px-4 pb-3 pt-1">
                                <p className="text-2xl font-semibold text-gray-900">{userName}</p>
                                <p className="text-lg text-gray-500">{userEmail || 'admin@dymlocation.com'}</p>
                            </div>
                            <div className="px-2 py-2">
                                <MenuItem>
                                    <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-lg text-[#1f3c66] hover:bg-gray-50"><MenuIconProfile />Mon profil</Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href="/settings" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-lg text-[#1f3c66] hover:bg-gray-50"><MenuIconSettings />Paramètres</Link>
                                </MenuItem>
                            </div>
                            <div className="border-t border-gray-100 px-2 pb-2 pt-2">
                                <MenuItem>
                                    <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-lg text-red-600 hover:bg-red-50"><MenuIconLogout />Déconnexion</Link>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </header>
    );
}

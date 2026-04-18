import { Avatar, AvatarFallback } from '@/Components/ui/Avatar';
import { Link } from '@inertiajs/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

function IconMenu() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16" /><path d="M4 12h12" /><path d="M4 17h16" /></svg>;
}

function IconHome() {
    return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10.5V20h14v-9.5" /></svg>;
}

function IconSearch() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}

function IconMoon() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg>;
}

function IconBell() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 17H5.8a1 1 0 0 1-.8-1.6l1.2-1.6V10a6 6 0 0 1 12 0v3.8l1.2 1.6a1 1 0 0 1-.8 1.6H17" /><path d="M9.5 19a2.5 2.5 0 0 0 5 0" /></svg>;
}

function IconApp() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16" /><path d="M10 20V10" /></svg>;
}

function MenuIconProfile() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>;
}

function MenuIconSettings() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .35 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.35 1.7 1.7 0 0 0-1 1.55V22a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.35l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.35-1.87l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.35l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" /></svg>;
}

function MenuIconLogout() {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 17 15 12 10 7" /><path d="M15 12H4" /><path d="M12 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" /></svg>;
}

export default function Topbar({ title, onOpenSidebar, userName, userEmail, userInitials }) {
    const firstName = userName?.trim()?.split(' ')?.[0] || userName || 'Utilisateur';

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onOpenSidebar}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 lg:hidden"
                    aria-label="Ouvrir le menu"
                >
                    <IconMenu />
                </button>

                <div className="hidden min-w-[220px] items-center gap-2 text-slate-500 lg:flex">
                    <button
                        type="button"
                        onClick={onOpenSidebar}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        aria-label="Afficher la barre latérale"
                    >
                        <IconMenu />
                    </button>
                    <IconHome />
                    <span>/</span>
                    <span className="text-xl font-semibold text-[#12305d]">{title}</span>
                </div>

                <div className="hidden flex-1 justify-center md:flex">
                    <label className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-400 focus-within:border-[#12305d] focus-within:bg-white">
                        <IconSearch />
                        <input
                            type="search"
                            placeholder="Rechercher..."
                            className="w-full border-none bg-transparent p-0 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                        />
                    </label>
                </div>

                <div className="ml-auto flex items-center gap-1 text-[#12305d] sm:gap-2">
                    <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100" aria-label="Basculer le thème">
                        <IconMoon />
                    </button>
                    <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
                        <IconBell />
                        <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">82</span>
                    </button>

                    <div className="hidden items-center gap-2 px-2 text-[#12305d] md:flex">
                        <IconApp />
                        <span className="font-medium tracking-wide">DYM ANGRE</span>
                        <span className="text-xs">▾</span>
                    </div>

                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1 transition hover:border-slate-200 hover:bg-slate-50">
                            <Avatar>
                                <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                            <div className="hidden text-left sm:block">
                                <p className="text-2xl font-semibold leading-none text-slate-900">{firstName}</p>
                                <p className="mt-1 text-sm text-slate-500">Admin</p>
                            </div>
                            <span className="hidden text-slate-400 sm:inline">▾</span>
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

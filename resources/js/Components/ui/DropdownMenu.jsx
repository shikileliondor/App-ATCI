import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export function DropdownMenu({ trigger, children }) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton as="div">{trigger}</MenuButton>
            <MenuItems anchor="bottom end" className="z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none">{children}</MenuItems>
        </Menu>
    );
}

export function DropdownMenuItem({ children, onClick, danger = false }) {
    return (
        <MenuItem>
            <button type="button" onClick={onClick} className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}>{children}</button>
        </MenuItem>
    );
}

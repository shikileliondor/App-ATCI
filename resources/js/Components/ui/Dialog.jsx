import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function AppDialog({ open, onClose, title, description, children }) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-gray-900/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                    <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                    {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
                    <div className="mt-4">{children}</div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

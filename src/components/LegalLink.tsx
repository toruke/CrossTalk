"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import PrivacyPage from "@/app/(legal)/privacy/page";
import TermsPage from "@/app/(legal)/terms/page";

export function LegalLink({
    type,
    text,
    className
}: {
    type: "privacy" | "terms",
    text: string,
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={className}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(true);
                    }}
                >
                    {text}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-[90vw]">
                <DialogHeader>
                    <DialogTitle>
                        {type === "privacy" ? "Politique de Confidentialité" : "Conditions Générales d'Utilisation"}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {type === "privacy" ? <PrivacyPage /> : <TermsPage />}
                </div>
            </DialogContent>
        </Dialog>
    );
}

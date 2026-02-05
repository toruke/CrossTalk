
export default function TermsPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation (CGU)</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
                    <p className="text-muted-foreground">
                        Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de la plateforme CrossTalk.
                        En accédant au site, vous acceptez sans réserve les présentes conditions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Accès aux services</h2>
                    <p className="text-muted-foreground">
                        L'accès à la plateforme est réservé aux utilisateurs inscrits.
                        L'inscription nécessite la création d'un compte personnel. Vous êtes responsable de la confidentialité de vos identifiants.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Code de conduite</h2>
                    <p className="mb-2">En utilisant CrossTalk, vous vous engagez à :</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Ne pas publier de contenu illégal, haineux, ou inapproprié.</li>
                        <li>Respecter les autres utilisateurs (élèves et professeurs).</li>
                        <li>Ne pas tenter de pirater ou de perturber le fonctionnement du site.</li>
                        <li>Ne pas utiliser la plateforme à des fins commerciales non autorisées.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
                    <p className="text-muted-foreground">
                        L'ensemble des contenus (cours, textes, graphismes, logos) présents sur le site sont la propriété exclusive de CrossTalk ou de ses partenaires.
                        Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Responsabilité</h2>
                    <p className="text-muted-foreground">
                        CrossTalk s'efforce d'assurer la disponibilité du service, mais ne saurait être tenu responsable des interruptions pour maintenance ou problèmes techniques.
                        Nous ne sommes pas responsables des contenus échangés entre utilisateurs, bien que nous nous réservions le droit de modérer les contenus signalés.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Modification des CGU</h2>
                    <p className="text-muted-foreground">
                        Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés des modifications substantielles.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Droit applicable</h2>
                    <p className="text-muted-foreground">
                        Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du siège social de CrossTalk.
                    </p>
                </section>
            </div>
        </div>
    );
}

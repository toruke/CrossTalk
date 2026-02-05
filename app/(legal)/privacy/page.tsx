
export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Préambule</h2>
                    <p className="text-muted-foreground">
                        La présente politique de confidentialité explique comment CrossTalk ("nous", "notre") collecte, utilise et protège vos données personnelles lorsque vous utilisez notre plateforme d'apprentissage des langues.
                        Nous nous engageons à respecter le Règlement Général sur la Protection des Données (RGPD).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
                    <p className="mb-2">Nous collectons les types de données suivants :</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Informations d'identité :</strong> Nom, prénom (via Clerk).</li>
                        <li><strong>Informations de contact :</strong> Adresse email.</li>
                        <li><strong>Données d'apprentissage :</strong> Progression dans les cours, scores aux quiz, langues étudiées.</li>
                        <li><strong>Messages :</strong> Contenu des échanges entre élèves et professeurs (stockés de manière sécurisée).</li>
                        <li><strong>Données techniques :</strong> Logs de connexion, adresse IP (pour la sécurité).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
                    <p className="mb-2">Vos données sont utilisées pour :</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Fournir et gérer votre accès aux cours et services.</li>
                        <li>Permettre la communication entre élèves et professeurs.</li>
                        <li>Suivre votre progression pédagogique et personnaliser votre apprentissage.</li>
                        <li>Assurer la sécurité de la plateforme et prévenir la fraude.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Durée de conservation</h2>
                    <p className="text-muted-foreground">
                        Vos données personnelles sont conservées aussi longtemps que votre compte est actif.
                        En cas de suppression de compte, vos données d'identification sont supprimées, sauf obligation légale contraire.
                        Les messages peuvent être conservés pour une durée limitée à des fins de modération et d'historique pédagogique.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Partage des données</h2>
                    <p className="text-muted-foreground">
                        Nous ne vendons JAMAIS vos données personnelles. Elles peuvent être partagées uniquement avec :
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                        <li>Nos prestataires de services techniques (hébergement, authentification via Clerk).</li>
                        <li>Les autorités compétentes si la loi l'exige.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
                    <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Droit d'accès et de rectification de vos données.</li>
                        <li>Droit à l'effacement ("droit à l'oubli").</li>
                        <li>Droit à la limitation du traitement.</li>
                        <li>Droit à la portabilité de vos données.</li>
                    </ul>
                    <p className="mt-4 text-muted-foreground">
                        Pour exercer ces droits, vous pouvez nous contacter via le support de la plateforme ou par email.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                    <p className="text-muted-foreground">
                        Nous utilisons des cookies essentiels au fonctionnement du site (session, préférences).
                        Vous pouvez gérer vos préférences en matière de cookies via notre bannière de consentement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Sécurité</h2>
                    <p className="text-muted-foreground">
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou altération.
                        Les échanges de données sont chiffrés (HTTPS/WSS).
                    </p>
                </section>
            </div>
        </div>
    );
}

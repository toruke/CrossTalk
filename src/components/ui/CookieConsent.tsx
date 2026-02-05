"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent");
    if (consent === null) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-primary/20 shadow-lg backdrop-blur-sm bg-background/95">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg">🍪 Utilisation des Cookies</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 -mt-1 -mr-1" 
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Nous utilisons des cookies essentiels pour assurer le bon fonctionnement du site et améliorer votre expérience. 
            Aucun cookie publicitaire n'est utilisé sans votre consentement.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <Button onClick={handleAccept} className="flex-1">
                Accepter
              </Button>
              <Button onClick={handleDecline} variant="outline" className="flex-1">
                Refuser
              </Button>
            </div>
            <Button variant="link" size="sm" asChild className="text-xs text-muted-foreground">
              <Link href="/privacy">
                En savoir plus sur notre politique de confidentialité
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

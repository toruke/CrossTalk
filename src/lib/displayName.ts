/**
 * Génère un nom d'affichage pour un utilisateur
 * Format: "Prénom Nom"
 */
export function getDisplayName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Obtient les initiales d'un utilisateur pour les avatars
 */
export function getInitials(user: { firstName: string; lastName: string }): string {
  return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
}

// Signature de l'erreur « onglet périmé après un redéploiement » : Next.js ne
// retrouve plus l'identifiant d'une Server Action (regénéré à chaque build).
// Bénin et auto-réparable en rechargeant la page.
export const STALE_DEPLOY_RE =
  /server action .* was not found on the server|failed[- ]to[- ]find[- ]server[- ]action|UnrecognizedActionError/i;

export function isStaleDeployMessage(value: unknown): boolean {
  const msg =
    typeof value === "string"
      ? value
      : (value as { message?: string } | null | undefined)?.message;
  return typeof msg === "string" && STALE_DEPLOY_RE.test(msg);
}

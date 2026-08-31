# Templates e-mail Supabase (français) — Chill Meals

À coller dans **Supabase → Authentication → Email Templates**.
Chaque template a un **Subject** (champ séparé) et un **Message body** (HTML).
Variables Supabase utilisées : `{{ .ConfirmationURL }}` (lien d'action).

Seuls deux templates sont réellement utilisés par l'app (auth par mot de passe +
reset) : **Confirm signup** et **Reset Password**. Les autres (Magic Link, Invite,
Change Email) peuvent rester tels quels — l'app ne s'en sert pas.

---

## 1. Confirm signup

**Subject :**
```
Activez votre compte Chill Meals 🍽️
```

**Message body :**
```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#433c48">
  <h2 style="font-size:22px;margin:0 0 12px">Bienvenue sur Chill Meals 🍽️</h2>
  <p style="font-size:15px;line-height:1.5;margin:0 0 20px">
    Merci pour votre inscription ! Cliquez sur le bouton ci-dessous pour activer
    votre compte et commencer à planifier vos repas.
  </p>
  <p style="margin:0 0 24px">
    <a href="{{ .ConfirmationURL }}"
       style="display:inline-block;background:#c1913f;color:#fff;text-decoration:none;
              font-weight:600;padding:12px 24px;border-radius:9999px;font-size:15px">
      Activer mon compte
    </a>
  </p>
  <p style="font-size:13px;line-height:1.5;color:#8a8290;margin:0">
    Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.
  </p>
</div>
```

---

## 2. Reset Password

**Subject :**
```
Réinitialisez votre mot de passe Chill Meals
```

**Message body :**
```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#433c48">
  <h2 style="font-size:22px;margin:0 0 12px">Réinitialisation du mot de passe</h2>
  <p style="font-size:15px;line-height:1.5;margin:0 0 20px">
    Nous avons reçu une demande de réinitialisation de votre mot de passe.
    Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
  </p>
  <p style="margin:0 0 24px">
    <a href="{{ .ConfirmationURL }}"
       style="display:inline-block;background:#c1913f;color:#fff;text-decoration:none;
              font-weight:600;padding:12px 24px;border-radius:9999px;font-size:15px">
      Réinitialiser mon mot de passe
    </a>
  </p>
  <p style="font-size:13px;line-height:1.5;color:#8a8290;margin:0">
    Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail sans problème.
  </p>
</div>
```

# Rapport d'audit d'accessibilité : [Nom de la fonctionnalité/page]

## Résumé

**Conformité WCAG 2.1 AA** : ✅ CONFORME | ⚠️ PARTIEL | ❌ NON CONFORME
**Problèmes critiques** : [nombre]
**Problèmes importants** : [nombre]
**Suggestions** : [nombre]
**Évaluation globale** : [Résumé d'une phrase]

## Score de conformité WCAG 2.1

| Principe           | Score   | Statut   |
| ------------------ | ------- | -------- |
| **Perceptible**    | [X]/100 | ✅/⚠️/❌ |
| **Utilisable**     | [X]/100 | ✅/⚠️/❌ |
| **Compréhensible** | [X]/100 | ✅/⚠️/❌ |
| **Robuste**        | [X]/100 | ✅/⚠️/❌ |
| **Global**         | [X]/100 | ✅/⚠️/❌ |

---

## Problèmes critiques 🔴 (À corriger)

### [Titre du problème]

**Critère WCAG** : [X.X.X Niveau AA]
**Impact** : Élevé - Empêche l'accès pour [groupe d'utilisateurs]
**Emplacement** : `[fichier:ligne]` ou [Page/Composant]

**Problème** :
[Description détaillée du problème]

**Code actuel** :

```html
[Code problématique]
```

**Recommandation** :

```html
[Code corrigé]
```

**Utilisateurs affectés** :
[Qui est impacté : utilisateurs de clavier, utilisateurs de lecteurs d'écran, etc.]

---

## Problèmes importants 🟠 (Devrait être corrigé)

[Même format que les problèmes critiques]

---

## Suggestions 🟡 (Agréable à avoir)

[Même format que les problèmes critiques]

---

## Audit de la navigation au clavier

**Statut** : ✅ EXCELLENT | ⚠️ PROBLÈMES TROUVÉS | ❌ CASSÉ
**Ordre de tabulation** : ✅ Logique | ⚠️ Problèmes | ❌ Cassé
**Indicateurs de focus** : ✅ Visibles | ⚠️ Incohérents | ❌ Manquants
**Pièges à clavier** : ✅ Aucun | ❌ Trouvé [nombre]

---

## Compatibilité avec les lecteurs d'écran

**NVDA (Windows)** : ✅ Compatible | ⚠️ Problèmes | ❌ Cassé
**VoiceOver (macOS)** : ✅ Compatible | ⚠️ Problèmes | ❌ Cassé

**Utilisation d'ARIA** :

- Étiquettes : ✅ Appropriées | ⚠️ Problèmes | ❌ Manquantes
- Points de repère : ✅ Présents | ⚠️ Incomplets | ❌ Manquants
- Régions live : ✅ Fonctionnelles | ⚠️ Problèmes | ❌ Manquantes

---

## Analyse des couleurs et du contraste

**Statut** : ✅ CONFORME | ⚠️ PROBLÈMES TROUVÉS | ❌ NON CONFORME

| Élément      | Premier plan | Arrière-plan | Ratio | Requis | Statut |
| ------------ | ------------ | ------------ | ----- | ------ | ------ |
| Texte normal | #XXXXXX      | #XXXXXX      | X.X:1 | 4.5:1  | ✅/❌  |
| Grand texte  | #XXXXXX      | #XXXXXX      | X.X:1 | 3:1    | ✅/❌  |

---

## Actions à entreprendre

### Must Fix (Bloquant - Violations WCAG)

1. [Problème d'accessibilité critique 1]

### Should Fix (Haute Priorité)

1. [Problème d'accessibilité important 1]

---

## Liste de contrôle de conformité

- [ ] Tous les éléments interactifs sont accessibles au clavier
- [ ] Les indicateurs de focus sont visibles et clairs
- [ ] Pas de pièges à clavier
- [ ] Les étiquettes ARIA sont présentes et précises
- [ ] Le contraste des couleurs respecte WCAG AA
- [ ] L'information ne repose pas uniquement sur la couleur
- [ ] Les images ont un texte alternatif
- [ ] Les entrées de formulaire ont des étiquettes
- [ ] Les messages d'erreur sont accessibles
- [ ] Les cibles tactiles sont ≥ 44x44px

**Verdict final** : ✅ CONFORME WCAG 2.1 AA | ⚠️ CONFORME SOUS CONDITIONS | ❌ NON CONFORME

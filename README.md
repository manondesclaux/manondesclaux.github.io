# Portfolio — Manon Desclaux

Portfolio de **Manon Desclaux**, Product Owner / Product Manager.

Site statique (HTML, CSS, JavaScript), sans dépendance ni étape de build.

## Structure

```
index.html          Page unique (hero, à propos, projets, expérience, outils, recommandations, contact)
css/style.css       Styles + responsive (≤ 900 px tablette, ≤ 600 px mobile)
js/script.js        Animations (machine à écrire, apparitions au défilement, bandeau d'outils)
js/i18n.js          Traduction anglaise (bouton EN / FR du header)
images/             Photos, visuels de projets, logos
documents/          CV et fichier Excel de l'étude TikTok
```

## Version anglaise

La page se charge en français. Le bouton « EN » en bout de header traduit toute la page, « FR » revient au français.
Lien direct vers la version anglaise : https://manondesclaux.github.io/?lang=en

Les traductions sont dans `js/i18n.js` (phrase française → phrase anglaise). Si un texte français change dans `index.html`, mettre à jour la ligne correspondante dans ce fichier, sinon il restera en français dans la version anglaise.

## Voir le site en local

Ouvrir `index.html` dans un navigateur, ou utiliser l'extension « Live Server » de VS Code.

## Mise en ligne

Publié avec GitHub Pages depuis la branche `main` (dossier racine).

## Mise à jour du cache (Safari, etc.)

`index.html` charge `css/style.css`, `js/script.js` et `js/i18n.js` avec un numéro de version (`?v=AAAA-MM-JJ`).
À chaque modification de ces fichiers, changer ce numéro dans `index.html` : les navigateurs rechargent alors les nouveaux fichiers au lieu de garder l'ancienne version en mémoire.

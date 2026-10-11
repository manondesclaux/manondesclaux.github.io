const typewriterText = document.querySelector(".typewriter-text");

const text = "TURNING NEEDS INTO PRODUCTS.";

let index = 0;
let typingTimer = null;

const keyTimings = [
    0.000, 0.081, 0.174, 0.290, 0.372, 0.499, 0.592, 0.720,
    0.801, 0.894, 1.033, 1.091, 1.138, 1.231, 1.347, 1.393,
    1.591, 1.637, 1.695, 1.776, 1.834, 1.881, 1.939, 2.032,
    2.101, 2.264, 2.368, 2.438
];

function typeText() {
    if (index >= text.length) {
        typingTimer = null;
        return;
    }

    typewriterText.textContent += text[index];
    index++;

    if (index < text.length) {
        const delay =
            (keyTimings[index] - keyTimings[index - 1]) * 1000;

        typingTimer = setTimeout(typeText, delay);
    } else {
        typingTimer = null;
    }
}

function startTypewriter() {
    clearTimeout(typingTimer);

    index = 0;
    typewriterText.textContent = "";

    typeText();
}

setTimeout(() => {
    startTypewriter();
}, 800);



/* ========================================
   ANIMATION TYPEWRITER — EXPÉRIENCES
======================================== */

const experienceTexts = document.querySelectorAll(".experience-typewriter");

// Crée une place fixe pour chaque caractère,
// regroupés par mot pour que le texte passe à la ligne entre les mots
function buildExperienceCharacters(element, fullText) {
    element.textContent = "";

    const characters = [];

    fullText.split(" ").forEach((word, wordIndex) => {
        if (wordIndex > 0) {
            const space = document.createElement("span");

            space.className = "typewriter-char";
            space.textContent = " ";

            element.appendChild(space);
            characters.push(space);
        }

        const wordSpan = document.createElement("span");
        wordSpan.className = "typewriter-word";

        Array.from(word).forEach((character) => {
            const span = document.createElement("span");

            span.className = "typewriter-char";
            span.textContent = character;

            wordSpan.appendChild(span);
            characters.push(span);
        });

        element.appendChild(wordSpan);
    });

    return characters;
}

function normalizeExperienceText(text) {
    return text.replace(/\s+/g, " ").trim();
}

// Change le texte d'une photo (utilisé par la traduction FR / EN).
// Si l'animation a déjà démarré, le nouveau texte s'affiche directement en entier.
function setExperienceText(element, text) {
    const fullText = normalizeExperienceText(text);

    clearTimeout(element.typewriterTimer);

    if (element.dataset.typed !== "true") {
        element.textContent = fullText;
        return;
    }

    buildExperienceCharacters(element, fullText).forEach((character) => {
        character.classList.add("is-visible");
    });
}

if (experienceTexts.length > 0) {

    const experienceObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                const element = entry.target;
                const fullText = normalizeExperienceText(element.textContent);

                observer.unobserve(element);

                element.dataset.typed = "true";

                const characters = buildExperienceCharacters(element, fullText);

                let characterIndex = 0;

                function writeExperienceText() {

                    if (characterIndex >= characters.length) return;

                    characters[characterIndex].classList.add("is-visible");

                    const currentCharacter = fullText[characterIndex];
                    characterIndex++;

                    // Vitesse de frappe
                    let delay = 45;

                    if (currentCharacter === " ") {
                        delay = 20;
                    } else if ([".", ",", ":", ";"].includes(currentCharacter)) {
                        delay = 180;
                    }

                    if (characterIndex < characters.length) {
                        element.typewriterTimer = setTimeout(writeExperienceText, delay);
                    }
                }

                writeExperienceText();

            });

        },
        {
            threshold: 0.4
        }
    );

    experienceTexts.forEach((element) => {
        experienceObserver.observe(element);
    });
}

/* ========================================
   INDICATION MENU SKILLS
======================================== */

const skillsMenu = document.querySelector(".hero-skills-menu");

if (skillsMenu) {

    const skillItems = skillsMenu.querySelectorAll(".skill-menu-item");

    let skillsMenuDiscovered = false;

    /* Tremblement toutes les 2 secondes */
    const skillsHintInterval = setInterval(() => {

        /* Si le menu a déjà été découvert,
           on arrête définitivement */
        if (skillsMenuDiscovered) {
            clearInterval(skillsHintInterval);
            return;
        }

        /* Petit tremblement de chaque mot */
        skillItems.forEach((item) => {

            item.classList.remove("is-hinting");

            /* Permet de relancer l'animation */
            void item.offsetWidth;

            item.classList.add("is-hinting");

        });

    }, 2000);


    /* ========================================
       MENU DÉCOUVERT
    ======================================== */

    skillItems.forEach((item) => {

        item.addEventListener("click", () => {

            /* L'utilisateur a découvert
               au moins un menu */
            skillsMenuDiscovered = true;

            /* Arrêt définitif du rappel */
            clearInterval(skillsHintInterval);

            /* Nettoyage de l'animation en cours */
            skillItems.forEach((skill) => {
                skill.classList.remove("is-hinting");
            });

        });

    });

}

/* ========================================
   ANIMATION DES TITRES DE SECTION
======================================== */

const sectionHeadings = document.querySelectorAll(".section-heading");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }

        });
    },
    {
        threshold: 0.3
    }
);

sectionHeadings.forEach((heading) => {
    sectionObserver.observe(heading);
});

/* =========================================================
   PROJETS — ANIMATION À L'ENTRÉE DANS L'ÉCRAN
   ========================================================= */

const projectImages = document.querySelectorAll(
    ".projects .project-media img"
);

const projectObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);


projectImages.forEach((image) => {
    projectObserver.observe(image);
});

/* =========================================================
   OUTILS — VITESSE DE DÉFILEMENT
   ========================================================= */

const toolsTrack = document.querySelector(".tools-track");
const toolsWrapper = document.querySelector(".tools-track-wrapper");

if (toolsTrack && toolsWrapper) {

    toolsWrapper.addEventListener("mousemove", (event) => {

        const rect = toolsWrapper.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const width = rect.width;

        /* Zone d'accélération : 15 % de chaque côté */
        const edgeZone = width * 0.15;

        const isLeftEdge = mouseX < edgeZone;
        const isRightEdge = mouseX > width - edgeZone;

        if (isLeftEdge || isRightEdge) {

            /* Accélération */
            toolsTrack.classList.add("edge-fast");
            toolsTrack.classList.remove("is-hovered");

        } else {

            /* Ralentissement */
            toolsTrack.classList.remove("edge-fast");
            toolsTrack.classList.add("is-hovered");

        }
    });

    toolsWrapper.addEventListener("mouseleave", () => {

        toolsTrack.classList.remove("edge-fast");
        toolsTrack.classList.remove("is-hovered");

    });
}

// ANIMATION PHOTO — SECTION À PROPOS

const aboutCards = document.querySelectorAll(".about-card");

if (aboutCards.length > 0 && "IntersectionObserver" in window) {
    try {
        const aboutCardsObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.2
            }
        );

        aboutCards.forEach((card) => {
            aboutCardsObserver.observe(card);
        });
    } catch (error) {
        console.error("Impossible d'initialiser l'animation des cartes À propos.", error);
    }
}

const recommendationStars = document.querySelectorAll(".recommendation-stars");

if (recommendationStars.length > 0 && "IntersectionObserver" in window) {
    try {
        const recommendationStarsObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.remove("is-pending");
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.5
            }
        );

        recommendationStars.forEach((stars) => {
            stars.classList.add("is-pending");
            recommendationStarsObserver.observe(stars);
        });
    } catch (error) {
        recommendationStars.forEach((stars) => {
            stars.classList.remove("is-pending");
        });
        console.error("Impossible d'initialiser l'animation des étoiles des recommandations.", error);
    }
}

const aboutPhoto = document.querySelector(".about-photo");

if (aboutPhoto && "IntersectionObserver" in window) {
    try {
        const aboutPhotoObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.2
            }
        );
        aboutPhotoObserver.observe(aboutPhoto);
    } catch (error) {
        console.error("Impossible d'initialiser l'animation de la photo À propos.", error);
    }
}

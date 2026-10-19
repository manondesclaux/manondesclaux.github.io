/* Préférence système « réduire les animations » */
const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

if (prefersReducedMotion) {
    // Pas d'effet machine à écrire : le texte s'affiche directement
    typewriterText.textContent = text;
} else {
    setTimeout(() => {
        startTypewriter();
    }, 800);
}



/* ========================================
   ANIMATION TYPEWRITER — EXPÉRIENCES
======================================== */

const experienceTexts = document.querySelectorAll(".experience-typewriter");

// Crée une place fixe pour chaque caractère,
// regroupés par mot pour que le texte passe à la ligne entre les mots
function buildExperienceCharacters(element, fullText) {
    element.textContent = "";

    // Phrase entière lue d'un bloc par les lecteurs d'écran
    const readableText = document.createElement("span");
    readableText.className = "visually-hidden";
    readableText.textContent = fullText;
    element.appendChild(readableText);

    // Caractères animés : visibles, mais ignorés par les lecteurs d'écran
    const animatedText = document.createElement("span");
    animatedText.setAttribute("aria-hidden", "true");
    element.appendChild(animatedText);

    const characters = [];

    fullText.split(" ").forEach((word, wordIndex) => {
        if (wordIndex > 0) {
            const space = document.createElement("span");

            space.className = "typewriter-char";
            space.textContent = " ";

            animatedText.appendChild(space);
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

        animatedText.appendChild(wordSpan);
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

                // Le premier slogan garde son rythme ; les suivants s'écrivent ~3 fois plus vite
                const isFirstSlogan = element === experienceTexts[0];
                const speed = isFirstSlogan ? 1 : 0.35;

                observer.unobserve(element);

                element.dataset.typed = "true";

                const characters = buildExperienceCharacters(element, fullText);

                if (prefersReducedMotion) {
                    characters.forEach((character) => {
                        character.classList.add("is-visible");
                    });
                    return;
                }

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

                    delay = Math.round(delay * speed);

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

    let skillsMenuDiscovered = prefersReducedMotion;

    /* Nombre maximum de rappels (une animation ne doit pas durer indéfiniment) */
    const maxSkillsHints = 3;
    let skillsHintCount = 0;

    /* Tremblement toutes les 2 secondes */
    const skillsHintInterval = setInterval(() => {

        /* Si le menu a déjà été découvert, ou après 3 rappels,
           on arrête définitivement */
        if (skillsMenuDiscovered || skillsHintCount >= maxSkillsHints) {
            clearInterval(skillsHintInterval);
            return;
        }

        skillsHintCount++;

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

    /* Pause / reprise : bouton clavier (visible au focus) ou appui sur le bandeau */
    const toolsPauseButton = document.querySelector(".tools-pause");

    function setToolsPaused(paused) {
        toolsTrack.classList.toggle("is-paused", paused);

        if (toolsPauseButton) {
            toolsPauseButton.setAttribute("aria-pressed", String(paused));
        }
    }

    if (toolsPauseButton) {
        toolsPauseButton.addEventListener("click", () => {
            setToolsPaused(!toolsTrack.classList.contains("is-paused"));
        });
    }

    toolsWrapper.addEventListener("click", () => {
        setToolsPaused(!toolsTrack.classList.contains("is-paused"));
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


/* =========================================================
   PHOTOMATON — ANIMATION AUTOMATIQUE SUR ÉCRAN TACTILE
   Sans survol possible, les 4 photos passent l'une après l'autre
   en version fun puis reviennent à la photo neutre, en boucle,
   tant que le photomaton est visible à l'écran.
   ========================================================= */

const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
const photoItems = Array.from(document.querySelectorAll(".photo-item"));
const photobooth = document.querySelector(".photobooth-grid");

if (!canHover && !prefersReducedMotion && photoItems.length > 0 && photobooth) {

    const photoDuration = 1400;   // durée d'affichage de chaque photo fun (ms)

    let photoIndex = 0;
    let photoTimer = null;

    function showNextPhoto() {
        photoItems.forEach((item, index) => {
            item.classList.toggle("is-flipped", index === photoIndex);
        });

        photoIndex = (photoIndex + 1) % photoItems.length;
    }

    function startPhotoLoop() {
        if (photoTimer) return;

        showNextPhoto();
        photoTimer = setInterval(showNextPhoto, photoDuration);
    }

    function stopPhotoLoop() {
        clearInterval(photoTimer);
        photoTimer = null;

        photoItems.forEach((item) => item.classList.remove("is-flipped"));
    }

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startPhotoLoop();
                } else {
                    stopPhotoLoop();
                }
            });
        }, { threshold: 0.3 }).observe(photobooth);
    } else {
        startPhotoLoop();
    }

    // Pause quand l'onglet est en arrière-plan, reprise au retour
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopPhotoLoop();
            return;
        }

        const rect = photobooth.getBoundingClientRect();

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            startPhotoLoop();
        }
    });
}


/* =========================================================
   MENU — SECTION EN COURS
   La pastille du lien reste affichée pour la section visible.
   ========================================================= */

const navigationLinks = Array.from(document.querySelectorAll(".navigation-links a[href^='#']"));

const trackedSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

function setCurrentSection(id) {
    navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === "#" + id;

        link.classList.toggle("is-current", isCurrent);

        if (isCurrent) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function updateCurrentSection() {
    // Tout en bas de la page : la section Contact (courte) est la section en cours
    const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    if (atBottom && document.getElementById("contact")) {
        setCurrentSection("contact");
        return;
    }

    // Section qui occupe le milieu de l'écran
    const middle = window.innerHeight / 2;
    let current = null;

    trackedSections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= middle && rect.bottom > middle) {
            current = section.id;
        }
    });

    setCurrentSection(current);
}

if (trackedSections.length > 0) {
    let currentSectionFrame = null;

    window.addEventListener("scroll", () => {
        if (currentSectionFrame) return;

        currentSectionFrame = requestAnimationFrame(() => {
            currentSectionFrame = null;
            updateCurrentSection();
        });
    }, { passive: true });

    window.addEventListener("resize", updateCurrentSection);

    updateCurrentSection();
}


/* =========================================================
   CONTACT — COPIE DE L'ADRESSE E-MAIL
   Le lien ouvre toujours la messagerie ; en plus, l'adresse
   est copiée, au cas où aucune messagerie n'est configurée.
   ========================================================= */

const contactEmail = "manondesclaux.pro@gmail.com";

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    // Solution de repli pour les anciens navigateurs
    return new Promise((resolve, reject) => {
        const field = document.createElement("textarea");

        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";

        document.body.appendChild(field);
        field.select();

        const copied = document.execCommand("copy");

        document.body.removeChild(field);

        if (copied) {
            resolve();
        } else {
            reject();
        }
    });
}

document.querySelectorAll(".contact a[href^='mailto:']").forEach((link) => {
    // Message de confirmation, annoncé aussi par les lecteurs d'écran
    const feedback = document.createElement("span");

    feedback.className = "copy-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");

    link.insertAdjacentElement("afterend", feedback);

    let feedbackTimer = null;

    link.addEventListener("click", () => {
        copyText(contactEmail)
            .then(() => {
                const english = document.documentElement.lang === "en";

                // Sous l'adresse elle-même, inutile de la répéter
                const showAddress = !link.classList.contains("contact-link");

                const message = english ? "Address copied" : "Adresse copiée";

                feedback.textContent = showAddress
                    ? message + (english ? ": " : " : ") + contactEmail
                    : message;

                feedback.classList.add("is-visible");

                clearTimeout(feedbackTimer);

                feedbackTimer = setTimeout(() => {
                    feedback.classList.remove("is-visible");
                    feedback.textContent = "";
                }, 3000);
            })
            .catch(() => {
                // Copie impossible : le lien mailto fonctionne quand même
            });
    });
});

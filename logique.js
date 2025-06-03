const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const body = document.querySelector("body");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//const G = 6.67e-11; // Constante gravitationnelle
const G = 0.5; // Constante gravitationnelle
let dt = 1; // Intervalle de temps pour la simulation

class Corps {
    constructor(x, y, masse, vx = 0, vy = 0, couleur = "white", taille = 10, zoomIdeal, fixe = false) {
        this.x = x;
        this.y = y;
        this.masse = masse;
        this.vx = vx;
        this.vy = vy;
        this.couleur = couleur;
        this.taille = taille; // Taille du corps pour le dessin
        this.fixe = fixe; // Indique si le corps est fixe (comme une étoile)
        this.zoomIdeal = zoomIdeal; // Zoom idéal pour observer le corps
    }

    appliquerAttractionDe(autre) {
        if (this.fixe) return; // Ne pas appliquer de force si le corps est fixe
        const dx = autre.x - this.x;
        const dy = autre.y - this.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const force = G * this.masse * autre.masse / distSq;
        const ax = force * dx / dist / this.masse;
        const ay = force * dy / dist / this.masse;
        this.vx += ax * dt;
        this.vy += ay * dt;
    }

    copy() {
        return new Corps(this.x, this.y, this.masse, this.vx, this.vy, this.couleur, this.taille, this.fixe);
    }

    majPosition() {
        if (this.fixe) return; // Ne pas appliquer de force si le corps est fixe
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    dessiner(ctx) {
    // Dessiner l'aura (si zoom très petit, elle restera visible)
    const auraTaille = Math.min(1000, Math.max(this.taille/zoom, 5)); // Taille minimale de l'aura
    ctx.beginPath();
    ctx.fillStyle = this.couleur;
    ctx.globalAlpha = 0.1; // Aura très transparente
    ctx.arc(this.x, this.y, auraTaille, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1; // Rétablir l'opacité normale

    // Dessiner le corps principal
    ctx.beginPath();
    ctx.fillStyle = this.couleur;
    ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2);
    ctx.fill();
}

}
// Adapter la distance pour l'affichage
function adapterDistance(distance) {
    return distance / 15000; // Par exemple, diviser par 15000 pour réduire l'échelle
}
// Adapter la masse pour l'affichage
function adapterMasse(masse) {
    return masse / 6e24; // Diviser par le poid de la Terre car on la prend pour référence
}
// Soleil (fixe)
const soleil = new Corps(canvas.width / 3, canvas.height / 2, 1000000, 0, 0, "yellow", 1000, true);

// Mercure
const distanceMercure = adapterDistance(58e6);
const masseMercure = adapterMasse(3.3e23);
const vitesseMercure = Math.sqrt(G * soleil.masse / distanceMercure);
const Mercure = new Corps(soleil.x + distanceMercure, soleil.y, masseMercure, 0, vitesseMercure, "orange", 10, 1.5);
// Venus
const distanceVenus = adapterDistance(108e6);
const masseVenus = adapterMasse(4.867e24);
const vitesseVenus = Math.sqrt(G * soleil.masse / distanceVenus);
const Venus = new Corps(soleil.x + distanceVenus, soleil.y, masseVenus, 0, vitesseVenus, "white", 13, 1.3);
// Terre
const distanceTerre = adapterDistance(150e6);
const masseTerre = adapterMasse(5.973e24);
const vitesseTerre = Math.sqrt(G * soleil.masse / distanceTerre);
const Terre = new Corps(soleil.x + distanceTerre, soleil.y, masseTerre, 0, vitesseTerre, "rgb(0, 162, 255)", 15, 1.2);
// Lune de la Terre
const distanceLuneTerre = adapterDistance(384000); // Distance moyenne de ka lune à la Terre
const masseLuneTerre = adapterMasse(1.4819e23); // Masse de la lune
const vitesseLuneTerre = Math.sqrt(G * masseTerre / distanceLuneTerre);
const LuneTerre = new Corps(Terre.x + distanceLuneTerre, Terre.y, masseLuneTerre, 0, vitesseTerre + vitesseLuneTerre, "white", 4, 2);
// Mars
const distanceMars = adapterDistance(227e6);
const masseMars = adapterMasse(6e24);
const vitesseMars = Math.sqrt(G * soleil.masse / distanceMars);
const Mars = new Corps(soleil.x + distanceMars, soleil.y, masseMars, 0, vitesseMars, "rgb(255, 131, 131)", 15, 1.2);
// Jupiter
const distanceJupiter = adapterDistance(770e6);
const masseJupiter = adapterMasse(6.418e23);
const vitesseJupiter = Math.sqrt(G * soleil.masse / distanceJupiter);
const Jupiter = new Corps(soleil.x + distanceJupiter, soleil.y, masseJupiter, 0, vitesseJupiter, "rgb(255, 214, 180)", 200, 0.5);

// Ganymède (lune de Jupiter)
const distanceGanimede = adapterDistance(1.0704e6)+200; // Distance moyenne de Ganymède à Jupiter ( + 200 sinon elle est visuellement dans jupiter)
const masseGanimede = adapterMasse(1.4819e23); // Masse de Ganymède
const vitesseGanimede = Math.sqrt(G * masseJupiter / distanceGanimede);
const Ganimede = new Corps(Jupiter.x + distanceGanimede, Jupiter.y, masseGanimede, 0, vitesseJupiter + vitesseGanimede, "white", 18, 1.5);
// Saturne
const distanceSaturne = adapterDistance(1.427e9);
const masseSaturne = adapterMasse(5.684e26);
const vitesseSaturne = Math.sqrt(G * soleil.masse / distanceSaturne);
const Saturne = new Corps(soleil.x + distanceSaturne, soleil.y, masseSaturne, 0, vitesseSaturne, "rgb(255, 212, 156)", 150, 0.5);
// Uranus
const distanceUranus = adapterDistance(2.87e9);
const masseUranus = adapterMasse(8.681e25);
const vitesseUranus = Math.sqrt(G * soleil.masse / distanceUranus);
const Uranus = new Corps(soleil.x + distanceUranus, soleil.y, masseUranus, 0, vitesseUranus, "rgb(185, 229, 255)", 120, 0.5);
// Neptune
const distanceNeptune = adapterDistance(4.5e9);
const masseNeptune = adapterMasse(1.024e26);
const vitesseNeptune = Math.sqrt(G * soleil.masse / distanceNeptune);
const Neptune = new Corps(soleil.x + distanceNeptune, soleil.y, masseNeptune, 0, vitesseNeptune, "rgb(0, 68, 255)", 120, 0.5);


// Liste des corps célestes
const bodies = {'Soleil':soleil, 'Mercure':Mercure, 'Venus':Venus, 'Terre':Terre, 'LuneTerre':LuneTerre, 'Mars':Mars, 'Jupiter':Jupiter, 'Ganimede':Ganimede, 'Saturne':Saturne, 'Uranus':Uranus, 'Neptune':Neptune};
const numCorps = {'Soleil':0, 'Mercure': 1, 'Venus': 2, 'Terre': 3, 'LuneTerre': 4, 'Mars': 5, 'Jupiter': 6, 'Ganimede': 7, 'Saturne': 8, 'Uranus': 9, 'Neptune': 10};
let corps = Object.values(bodies).filter(body => body !== null);


let camLock = false; // Variable pour contrôler le verrouillage de la caméra
let corpsLock = "Soleil"; // Corps sur lequel la caméra est centrée
let paused = false; // Variable pour contrôler la pause
async function animate() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Réinitialise la transformation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2); // Centre
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2); // Décale vers le coin
    ctx.setTransform(zoom, 0, 0, zoom, offsetX, offsetY);
    if(!paused){
        // Appliquer la gravité entre chaque corps (simple ici)
        for (let i = 0; i < corps.length; i++) {
            for (let j = 0; j < corps.length; j++) {
                if (i !== j) corps[i].appliquerAttractionDe(corps[j]);
            }
        }
    }
    if(camLock) {
        // Centrer la caméra sur le Mercure
        offsetX = canvas.width / 2 - corps[numCorps[corpsLock]].x * zoom;
        offsetY = canvas.height / 2 - corps[numCorps[corpsLock]].y * zoom;
    }



    corps.forEach(body => {
        if(!paused) body.majPosition();
        body.dessiner(ctx);
    });
    requestAnimationFrame(animate);
}

document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key === " ") {
        paused = !paused; // inverser pause
    }else if (event.key === "r") {
        // Réinitialiser les positions et vitesses à leur état initial
        corps = bodies.map(body => body.copy());
    }else if (event.key === "ArrowUp") {
        if(dt<128) dt *= 2; // Accélérer le temps
    }else if (event.key === "ArrowDown") {
        if(dt>1) dt /= 2; // Ralentir le temps
    }else if (event.key === "l") {
        camLock = !camLock; // Inverser le verrouillage de la caméra
    }
});

let zoom = 0.01;
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;


// Zoom avec la molette de la souris
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Coordonnées de la souris dans le repère transformé (avant zoom)
    const wx = (mouseX - offsetX);
    const wy = (mouseY - offsetY);

    const zoomFactor = 1.1;
    let newZoom = zoom;

    if (e.deltaY < 0) { // Zoom in
        newZoom = zoom * zoomFactor;
    } else { // Zoom out
        newZoom = zoom / zoomFactor;
    }

    newZoom = Math.min(Math.max(newZoom, 0.0001), 5);

    // Ajuste offset pour que la souris "reste au même endroit"
    offsetX = mouseX - wx * (newZoom / zoom);
    offsetY = mouseY - wy * (newZoom / zoom);

    zoom = newZoom;
});
// Bouton du milieu de la souris pour déplacer la vue
canvas.addEventListener("mousedown", (e) => {
    if(e.which === 2) { // Bouton du milieu de la souris
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    }
});
canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
    }
});
canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});
// Boutons pour sélectionner le corps sur lequel la caméra doit se verrouiller
let listeBtnFocus = body.querySelector("#menu-focus").querySelectorAll("button");
listeBtnFocus.forEach(btn => {
    btn.addEventListener("click", () => {
        corpsLock = btn.getAttribute("name");
        camLock = true; // Verrouiller la caméra sur le corps sélectionné
        smoothZoom(zoom, corps[numCorps[corpsLock]].zoomIdeal);
    });
});

function smoothZoom(zoomAvant, zoomApres) {
    const duree = 1000; // Durée de l'animation en ms
    const startTime = performance.now();

    function animationZoom(currentTime) {
        const tempsEcoule = currentTime - startTime;
        const t = Math.min(tempsEcoule / duree, 1); // Normalise entre 0 et 1
        const facteur = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; // Fonction d'interpolation (easing)
        zoom = zoomAvant + (zoomApres - zoomAvant) * facteur;
        if (t < 1) {
            requestAnimationFrame(animationZoom);
        }
    }
    requestAnimationFrame(animationZoom);
}



animate();
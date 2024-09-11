// Récupérer les travaux depuis l'API
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

// Afficher les travaux dans la galerie principale
async function displayWorks() {
    const works = await getWorks(); // Attente de la récupération des travaux
    works.forEach((work) => {
        createWorks(work);
    });
}

// Créer et ajouter des travaux dans la galerie
function createWorks(work) {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id; // Ajouter un attribut pour identifier le travail
    const img = document.createElement("img");
    img.src = work.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    let gallery = document.querySelector(".gallery"); // Sélection de la galerie
    gallery.appendChild(figure);
}

// Récupérer les catégories depuis l'API
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

// Afficher les catégories dans les filtres
async function displayCategories() {
    const categories = await getCategories(); // Attente de la récupération des catégories
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.innerHTML = category.name;
        btn.id = category.id;
        let filtres = document.querySelector(".filtres");
        filtres.appendChild(btn);
    });
    
    // Masquer les boutons de catégories si l'utilisateur est connecté
    const loged = window.sessionStorage.getItem('loged');
    if (loged === "true") {
        const buttons = document.querySelectorAll(".filtres button");
        buttons.forEach(button => {
            button.style.display = 'none';
        });
    }
}

// Ajouter des événements pour filtrer les travaux par catégorie
async function addFilterEventListeners() {
    const travaux = await getWorks(); // Récupérer tous les travaux
    const buttons = document.querySelectorAll(".filtres button");
    
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const btnId = e.target.id;
            let gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            
            if (btnId !== "0") {
                const worksTriCategory = travaux.filter((work) => {
                    return work.categoryId == btnId;
                });
                worksTriCategory.forEach(work => {
                    createWorks(work);
                });
            } else {
                travaux.forEach(work => {
                    createWorks(work);
                });
            }
        });
    });
}

// Afficher les travaux et les catégories au chargement
displayWorks();
displayCategories().then(() => addFilterEventListeners());

// Variables pour la modale
let modalWorks = document.querySelector("#modalWorks");
let addWorkForm = document.querySelector("#addWorkForm");
let addWorkButton = document.querySelector("#addWorkButton");
let closeModalButton = document.querySelector("#closeModalButton");
let photoInput = document.querySelector("#photo");
let titleInput = document.querySelector("#title");
let categorySelect = document.querySelector("#category");
let arrowBackButton = document.querySelector(".arrow-left"); // Bouton pour retourner à la première modale

// Sélection des éléments pour validation du formulaire
const validateButton = document.querySelector("#addWorkForm button"); // Bouton de validation du formulaire

// Fonction pour vérifier si les deux conditions sont remplies
function checkFormCompletion() {
    if (photoInput.files.length > 0 && titleInput.value.trim() !== "") {
        // Si une image est sélectionnée et que le titre n'est pas vide
        validateButton.style.backgroundColor = "#1d6154"; // Changer la couleur en vert
        validateButton.disabled = false; // Activer le bouton si désactivé
    } else {
        // Si l'une des conditions n'est pas remplie, remettre la couleur par défaut
        validateButton.style.backgroundColor = ""; // Remettre la couleur initiale
        validateButton.disabled = true; // Désactiver le bouton
    }
}

// Écouter les changements sur l'input file et le titre
photoInput.addEventListener("change", checkFormCompletion);
titleInput.addEventListener("input", checkFormCompletion);

// Désactiver le bouton par défaut tant que les conditions ne sont pas remplies
validateButton.disabled = true;

// Vérifier si l'utilisateur est connecté
const loged = window.sessionStorage.getItem('loged');
const logout = document.querySelector(".logout");
const containerModals = document.querySelector(".containerModals");
const faPen = document.querySelector(".fa-pen-to-square");
const edition = document.getElementById("navEdition");
const modifier = document.querySelector(".button-mod");
const faX = document.querySelector(".fa-x");
const addPhotoButton = document.querySelector(".modalWorks button"); // Bouton pour ajouter une photo
const modalForm = document.querySelector(".modal-form");
const arrowLeft = document.querySelector(".fa-arrow-left");

// Fonction pour vider la galerie dans la modal
function clearModalGallery() {
    const modalGallery = document.querySelector(".worksModal");
    modalGallery.innerHTML = ""; // Vider la galerie avant d'ajouter de nouveaux éléments
}

// Fonction pour ouvrir la modal avec les travaux
async function openModalWithWorks() {
    clearModalGallery(); // Vider la galerie avant d'ajouter les nouveaux travaux
    const works = await getWorks(); // Récupérer les travaux
    works.forEach(work => {
        createWorksInModal(work); // Ajouter chaque travail dans la modal
    });
    containerModals.style.display = 'flex'; // Ouvrir la modal
}

// Fonction pour créer un travail dans la modal
function createWorksInModal(work) {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id; // Ajouter un attribut pour identifier le travail
    const img = document.createElement("img");
    img.src = work.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;

    // Création du bouton de suppression
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("delete-btn");


    function removeFromGallery(workId) {
        // Sélectionner la galerie principale
        const gallery = document.querySelector(".gallery");
    
        // Trouver l'élément (figure) avec l'attribut data-id correspondant à workId
        const figureToRemove = gallery.querySelector(`figure[data-id='${workId}']`);
    
        // Si l'élément est trouvé, le supprimer
        if (figureToRemove) {
            figureToRemove.remove();
        }
    }
    // Attacher l'événement de suppression au bouton
    deleteButton.addEventListener("click", async () => {
        const token = window.sessionStorage.getItem('token'); // Récupération du token

        if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            try {
                const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Authentification via token
                    }
                });

                if (response.ok) {
                    figure.remove(); // Retirer l'élément de la modal
                    removeFromGallery(work.id); // Retirer l'élément de la galerie principale
                    alert("Projet supprimé avec succès !");
                } else if (response.status === 401) {
                    alert("Non autorisé. Veuillez vérifier vos permissions ou votre token.");
                } else {
                    alert("Une erreur s'est produite lors de la suppression du projet.");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Une erreur s'est produite lors de la suppression du projet.");
            }
        }
    });

    figure.appendChild(img);
    figure.appendChild(figcaption);
    figure.appendChild(deleteButton); // Ajouter le bouton de suppression à la figure

    let modalGallery = document.querySelector(".worksModal"); // Sélectionnez la galerie de la modale
    modalGallery.appendChild(figure);
}

// Fonction pour ouvrir le formulaire d'ajout de photo
async function openModalWithForm() {
    const modalWorks = document.querySelector(".modalWorks");

    // Masquer la galerie et afficher le formulaire
    modalWorks.style.display = 'none';
    modalForm.style.display = 'block';

    arrowLeft.addEventListener("click", () => {
        modalWorks.style.display = 'block';
        modalForm.style.display = 'none';

    });

    // Charger les catégories pour le formulaire
    const categories = await getCategories();
    categorySelect.innerHTML = ''; // Réinitialiser les options avant de les ajouter

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    // Gérer la soumission du formulaire
    const form = document.querySelector("#addWorkForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();  // Empêcher le rechargement de la page

    // Validation manuelle de l'image
    if (!photoInput.files.length) {
        alert("Veuillez sélectionner une image.");
        return;
    }

    const formData = new FormData();
    formData.append('image', photoInput.files[0]); // Le fichier image sélectionné
    formData.append('title', titleInput.value); // Le titre du projet
    formData.append('category', categorySelect.value); // L'ID de la catégorie
    
    const token = window.sessionStorage.getItem('token'); // Récupérer le token si nécessaire
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // Authentification via token
            },
            body: formData // Envoi du formData
        });

        if (response.ok) {
            const newWork = await response.json();

            // Ajouter le nouveau travail dans la galerie principale
            createWorks(newWork); 

            // Ajouter le nouveau travail dans la galerie de la modale
            createWorksInModal(newWork); 

            // Optionnel : réinitialiser le formulaire et l'aperçu de l'image après l'ajout
            form.reset();  // Réinitialiser le formulaire
            apercuImg.src = "";  // Réinitialiser l'aperçu de l'image
            apercuImg.style.display = "none";
            labelFile.style.display = "block";
            inconFile.style.display = "block";
            pFile.style.display = "block";

            // Retour à la première modal après l'ajout
            modalForm.style.display = 'none';
            modalWorks.style.display = 'block';

            alert("Projet ajouté avec succès !");
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
});
}


// Ouvrir la modal au clic sur le bouton Modifier
if (modifier) {
    modifier.addEventListener("click", openModalWithWorks);
}

// Ouvrir le formulaire d'ajout de photo au clic sur le bouton "Ajouter une photo"
if (addPhotoButton) {
    addPhotoButton.addEventListener("click", openModalWithForm);
}

// Fermer la modal au clic sur la croix
if (faX) {
    faX.addEventListener("click", () => {
        containerModals.style.display = 'none';
    });
}

// Fermer la modal au clic en dehors de celle-ci
window.addEventListener("click", (event) => {
    if (event.target === containerModals) {
        containerModals.style.display = 'none';
    }
});

// Faire la prévisualisation de l'image
const apercuImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const inconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");

// Écouter les changements sur l'input file
inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    console.log(file);
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            apercuImg.src = e.target.result;
            apercuImg.style.display = "flex";
            labelFile.style.display = "none";
            inconFile.style.display = "none";
            pFile.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

// Vérification de la connexion
if (loged === "true") {
    if (logout) {
        logout.textContent = "logout";
        logout.href = "./index.html"; // Définir l'attribut href de l'élément <a>
    }

    if (containerModals) {
        modifier.style.display = 'flex'; // Afficher le bouton de modification
    }

    edition.style.display = 'flex';
    
    const filterButtons = document.querySelectorAll('.filtres button');
    filterButtons.forEach(button => {
        button.style.display = 'none'; // Masquer les boutons de filtre
    });

    const displayCategories = document.querySelectorAll('.categories button');
    displayCategories.forEach(button => {
        button.style.display = 'none'; // Masquer les boutons de catégories
    });

    logout.addEventListener("click", () => {
        window.sessionStorage.setItem('loged', 'false'); // Définir 'loged' à 'false'
        window.location.href = "./login.html"; // Rediriger vers la page de connexion après déconnexion
    });
}

// Mes Variables
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");

// Fonction de connexion
async function login(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const userEmail = email.value;
  const userPwd = password.value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, password: userPwd }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la connexion");
    }

    const data = await response.json();

    // Si la connexion est réussie : 
    window.sessionStorage.setItem('token', data.token);  // Enregistrer le token reçu dans sessionStorage
    window.sessionStorage.setItem('loged', true);  // Indique que l'utilisateur est connecté

    // Redirige vers la page d'accueil
    window.location.href = "./index.html";

  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur dans l’identifiant ou le mot de passe.");
  }
}

form.addEventListener("submit", login);



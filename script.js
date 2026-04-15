const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "admin@streamer.com" && password === "1234") {
      loginMessage.textContent = "Inicio de sesión exitoso.";
      loginMessage.style.color = "green";
    } else {
      loginMessage.textContent = "Correo o contraseña incorrectos.";
      loginMessage.style.color = "red";
    }
  });
}

const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");

if (postForm) {
  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const postText = document.getElementById("postText").value.trim();

    if (postText.length > 0) {
      postMessage.textContent = "Publicación guardada correctamente.";
      postMessage.style.color = "green";
      document.getElementById("postText").value = "";
    } else {
      postMessage.textContent = "Escribe una publicación antes de guardar.";
      postMessage.style.color = "red";
    }
  });
}
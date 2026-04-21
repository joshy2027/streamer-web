const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      loginMessage.textContent = "Completa todos los campos.";
      loginMessage.style.color = "#ff6b6b";
    } else if (email === "admin@streamer.com" && password === "1234") {
      loginMessage.textContent = "Inicio de sesión exitoso. Redirigiendo al panel...";
      loginMessage.style.color = "#7CFC9A";

      setTimeout(() => {
        window.location.href = "admin.html";
      }, 1500);
    } else {
      loginMessage.textContent = "Correo o contraseña incorrectos.";
      loginMessage.style.color = "#ff6b6b";
    }
  });
}

const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const adminPosts = document.getElementById("adminPosts");
const totalPosts = document.getElementById("totalPosts");

function getSavedPosts() {
  const savedPosts = localStorage.getItem("streamerPosts");
  return savedPosts ? JSON.parse(savedPosts) : [];
}

function savePosts(posts) {
  localStorage.setItem("streamerPosts", JSON.stringify(posts));
}

function updatePostCounter(posts) {
  if (totalPosts) {
    totalPosts.textContent = posts.length;
  }
}

function renderPosts() {
  if (!adminPosts) return;

  const posts = getSavedPosts();
  updatePostCounter(posts);

  if (posts.length === 0) {
    adminPosts.innerHTML = '<p class="empty-posts">Aún no hay publicaciones registradas.</p>';
    return;
  }

  adminPosts.innerHTML = "";

  posts.forEach((post, index) => {
    const article = document.createElement("article");
    article.className = "saved-post";

    article.innerHTML = `
      <div class="saved-post-header">
        <h3>Publicación ${index + 1}</h3>
        <span>${post.date}</span>
      </div>
      <p>${post.text}</p>
      <button class="delete-btn" data-index="${index}">Eliminar</button>
    `;

    adminPosts.appendChild(article);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      const posts = getSavedPosts();
      posts.splice(index, 1);
      savePosts(posts);
      renderPosts();

      if (postMessage) {
        postMessage.textContent = "Publicación eliminada correctamente.";
        postMessage.style.color = "#ffb86b";
      }
    });
  });
}

if (postForm) {
  renderPosts();

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const postTextInput = document.getElementById("postText");
    const postText = postTextInput.value.trim();

    if (postText.length > 0) {
      const posts = getSavedPosts();
      const currentDate = new Date().toLocaleString("es-MX");

      posts.unshift({
        text: postText,
        date: currentDate,
      });

      savePosts(posts);
      renderPosts();

      postMessage.textContent = "Publicación guardada correctamente.";
      postMessage.style.color = "#7CFC9A";
      postTextInput.value = "";
    } else {
      postMessage.textContent = "Escribe una publicación antes de guardar.";
      postMessage.style.color = "#ff6b6b";
    }
  });
}
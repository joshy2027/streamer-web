const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const adminPosts = document.getElementById("adminPosts");
const totalPosts = document.getElementById("totalPosts");
const logoutBtn = document.getElementById("logoutBtn");
const postsList = document.getElementById("posts");
const formTitle = document.getElementById("formTitle");
const savePostBtn = document.getElementById("savePostBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editIndex = null;

function isAdminPage() {
  return window.location.pathname.includes("admin.html");
}

function isLoggedIn() {
  return localStorage.getItem("streamerLoggedIn") === "true";
}

function protectAdminPage() {
  if (isAdminPage() && !isLoggedIn()) {
    window.location.href = "login.html?acceso=denegado";
  }
}

protectAdminPage();

function showLoginNotice() {
  if (!loginMessage) return;

  const params = new URLSearchParams(window.location.search);

  if (params.get("acceso") === "denegado") {
    loginMessage.textContent = "Primero inicia sesión para entrar al panel administrativo.";
    loginMessage.style.color = "#ffb86b";
  }
}

showLoginNotice();

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      loginMessage.textContent = "Completa todos los campos.";
      loginMessage.style.color = "#ff6b6b";
    } else if (email === "admin@streamer.com" && password === "1234") {
      localStorage.setItem("streamerLoggedIn", "true");
      loginMessage.textContent = "Inicio de sesión exitoso. Redirigiendo al panel...";
      loginMessage.style.color = "#7CFC9A";

      setTimeout(() => {
        window.location.href = "admin.html";
      }, 1200);
    } else {
      localStorage.removeItem("streamerLoggedIn");
      loginMessage.textContent = "Correo o contraseña incorrectos.";
      loginMessage.style.color = "#ff6b6b";
    }
  });
}

function escapeHTML(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

function resetPostForm() {
  editIndex = null;

  if (postForm) {
    postForm.reset();
  }

  if (formTitle) {
    formTitle.textContent = "Agregar publicación";
  }

  if (savePostBtn) {
    savePostBtn.textContent = "Guardar publicación";
  }

  if (cancelEditBtn) {
    cancelEditBtn.classList.add("hidden");
  }
}

function renderAdminPosts() {
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
        <div>
          <h3>${escapeHTML(post.title)}</h3>
          <span>${escapeHTML(post.date || "Sin fecha")}</span>
        </div>
      </div>
      <p>${escapeHTML(post.text)}</p>
      <div class="post-actions">
        <button class="edit-btn" data-index="${index}">Editar</button>
        <button class="delete-btn" data-index="${index}">Eliminar</button>
      </div>
    `;

    adminPosts.appendChild(article);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      const posts = getSavedPosts();
      const post = posts[index];

      editIndex = index;
      document.getElementById("postTitle").value = post.title;
      document.getElementById("postText").value = post.text;

      if (formTitle) {
        formTitle.textContent = "Editar publicación";
      }

      if (savePostBtn) {
        savePostBtn.textContent = "Actualizar publicación";
      }

      if (cancelEditBtn) {
        cancelEditBtn.classList.remove("hidden");
      }

      if (postMessage) {
        postMessage.textContent = "Editando publicación seleccionada.";
        postMessage.style.color = "#ffb86b";
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number(this.dataset.index);
      const posts = getSavedPosts();

      posts.splice(index, 1);
      savePosts(posts);
      renderAdminPosts();
      resetPostForm();

      if (postMessage) {
        postMessage.textContent = "Publicación eliminada correctamente.";
        postMessage.style.color = "#ffb86b";
      }
    });
  });
}

function renderHomePosts() {
  if (!postsList) return;

  const posts = getSavedPosts();

  if (posts.length === 0) {
    postsList.innerHTML = `
      <li>Nuevo stream programado para este sábado.</li>
      <li>Directo especial de comunidad esta semana.</li>
      <li>Nuevo contenido subido al perfil.</li>
    `;
    return;
  }

  postsList.innerHTML = "";

  posts.forEach((post) => {
    const item = document.createElement("li");
    item.className = "home-post-item";
    item.innerHTML = `
      <strong>${escapeHTML(post.title)}</strong>
      <span>${escapeHTML(post.date || "Sin fecha")}</span>
      <p>${escapeHTML(post.text)}</p>
    `;
    postsList.appendChild(item);
  });
}

if (postForm) {
  renderAdminPosts();

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const titleInput = document.getElementById("postTitle");
    const postTextInput = document.getElementById("postText");

    const postTitle = titleInput.value.trim();
    const postText = postTextInput.value.trim();

    if (!postTitle || !postText) {
      postMessage.textContent = "Completa título y contenido.";
      postMessage.style.color = "#ff6b6b";
      return;
    }

    const posts = getSavedPosts();
    const currentDate = new Date().toLocaleString("es-MX");

    if (editIndex !== null) {
      posts[editIndex] = {
        title: postTitle,
        text: postText,
        date: `Editado: ${currentDate}`,
      };

      savePosts(posts);
      renderAdminPosts();
      resetPostForm();

      postMessage.textContent = "Publicación actualizada correctamente.";
      postMessage.style.color = "#7CFC9A";
    } else {
      posts.unshift({
        title: postTitle,
        text: postText,
        date: currentDate,
      });

      savePosts(posts);
      renderAdminPosts();
      resetPostForm();

      postMessage.textContent = "Publicación guardada correctamente.";
      postMessage.style.color = "#7CFC9A";
    }
  });
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", function () {
    resetPostForm();

    if (postMessage) {
      postMessage.textContent = "Edición cancelada.";
      postMessage.style.color = "#ffb86b";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("streamerLoggedIn");
    window.location.href = "login.html";
  });
}

renderHomePosts();

const API_URL = "http://localhost:5000";

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    alert(data.message);
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  });
}
// Upload File
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file");
    return;
  }

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await res.json();
  alert(data.message);

  loadFiles();
}

// Load User Files
async function loadFiles() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/files/my-files`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const files = await res.json();

  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

 files.forEach(file => {

  const li = document.createElement("li");

  const link = document.createElement("a");
  link.href = `${API_URL}/${file.filepath}`;
  link.textContent = file.filename;
  link.target = "_blank";

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";

  delBtn.onclick = () => deleteFile(file._id);

  li.appendChild(link);
  li.appendChild(delBtn);

  fileList.appendChild(li);

});
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Auto load files if on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  loadFiles();
}
// Update Bio
async function updateBio() {

  const bio = document.getElementById("bioText").value;

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/auth/update-bio`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({ bio })

  });

  const data = await res.json();

  alert(data.message);

}
// Delete File
async function deleteFile(id) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/files/delete/${id}`, {

    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`
    }

  });

  const data = await res.json();

  alert(data.message);

  loadFiles();

}
// Upload Profile Image

async function uploadProfileImage() {

 const fileInput = document.getElementById("profileImage");

 const file = fileInput.files[0];

 const token = localStorage.getItem("token");

 const formData = new FormData();

 formData.append("image", file);

 const res = await fetch(`${API_URL}/api/auth/upload-image`, {

   method:"POST",

   headers:{
     Authorization:`Bearer ${token}`
   },

   body:formData

 });

 const data = await res.json();

 alert(data.message);

}
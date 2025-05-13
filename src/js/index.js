import { createNoteItemElement, showCustomError, showLoader, hideLoader } from "./components.js";
import Swal from "sweetalert2";
import "../css/style.css";

const usersListElementForServer = document.querySelector("#notesList");
const form = document.querySelector("#noteForm");
const titleInput = document.querySelector("#title");
const bodyInput = document.querySelector("#body");
const titleError = document.querySelector("#titleError");
const bodyError = document.querySelector("#bodyError");

titleInput.addEventListener("input", () => {
  showCustomError(titleError, "Judul minimal 5 karakter.", titleInput.value.trim().length < 5);
});

bodyInput.addEventListener("input", () => {
  showCustomError(bodyError, "Isi catatan minimal 10 karakter.", bodyInput.value.trim().length < 10);
});

usersListElementForServer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-button")) {
    const noteId = event.target.getAttribute("data-id");

    const confirmation = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Catatan yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmation.isConfirmed) {
      await deleteNoteById(noteId);
    }
  }
});

titleInput.addEventListener("blur", () => titleError.removeAttribute("visible"));
bodyInput.addEventListener("blur", () => bodyError.removeAttribute("visible"));

async function usingRestfulApi() {
  showLoader();
  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    if (!response.ok) throw new Error("Gagal mengambil data!");

    const data = await response.json();
    const notes = data.data;

    usersListElementForServer.innerHTML = notes.map(createNoteItemElement).join("");
  } catch (error) {
    console.error("Error getting notes:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal Memuat Data",
      text: "Terjadi gangguan saat memuat data dari server.",
    });
  } finally {
    hideLoader();
  }
}

const addNewNote = async (e) => {
  e.preventDefault();

  if (titleInput.value.trim().length < 5 || bodyInput.value.trim().length < 10) {
    alert("Periksa kembali input Anda.");
    return;
  }

  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleInput.value,
        body: bodyInput.value,
      }),
    });

    const result = await response.json();
    if (result.status === "success") {
      await usingRestfulApi();
      form.reset();
    } else {
      console.error("Gagal menambahkan catatan:", result.message);
    }
  } catch (error) {
    console.error("Error saat menambahkan catatan:", error);
  }
};

export async function deleteNoteById(id) {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Gagal menghapus catatan");

    await usingRestfulApi();

    Swal.fire({
      icon: "success",
      title: "Catatan Dihapus",
      text: `Catatan dengan ID ${id} berhasil dihapus.`,
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal Menghapus",
      text: "Terjadi gangguan saat menghapus catatan.",
    });
  }
}
form.addEventListener("submit", addNewNote);
await usingRestfulApi();

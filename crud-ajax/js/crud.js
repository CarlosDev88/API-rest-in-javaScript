const d = document,
  $table = d.getElementById("crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const ajax = (options) => {
  //los parametros ban como objeto porque son muchos
  let { url, method, succes, error, data } = options;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      succes(json);
    } else {
      let message = xhr.statusText || "Ocurrio un error";
      error(`Error ${xhr.status}: ${message}`);
    }
  });

  xhr.open(method || "GET", url);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(data));
};

const getAll = () => {
  ajax({
    url: "http://localhost:5000/santos",
    method: "GET",
    succes: function (res) {
      res.forEach((element) => {
        $template.querySelector(".name").textContent = element.nombre;
        $template.querySelector(".constellation").textContent =
          element.constelacion;

        $template.querySelector(".edit").dataset.id = element.id;
        $template.querySelector(".edit").dataset.name = element.nombre;
        $template.querySelector(".edit").dataset.constellation =
          element.constelacion;

        $template.querySelector(".delete").dataset.id = element.id;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });

      $table.querySelector("tbody").appendChild($fragment);
    },
    error: function (err) {
      $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
    },
    data: null,
  });
};

d.addEventListener("DOMContentLoaded", getAll);
d.addEventListener("submit", (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //POST-create
      ajax({
        url: "http://localhost:5000/santos",
        method: "POST",
        succes: function (res) {
          location.reload();
        },
        error: function (err) {
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
        },
      });
    } else {
      //PUT-update

      ajax({
        url: `http://localhost:5000/santos/${e.target.id.value}`,
        method: "PUT",
        succes: function (res) {
          location.reload();
        },
        error: function (err) {
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
        },
      });
    }
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Santo";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estas sguro de eliminar el id: ? ${e.target.dataset.id}`
    );

    if (isDelete) {
      //Delete
      ajax({
        url: `http://localhost:5000/santos/${e.target.dataset.id}`,
        method: "DELETE",
        succes: function (res) {
          location.reload();
        },
        error: function (err) {
          alert(err);
        },
      });
    } else {
    }
  }
});

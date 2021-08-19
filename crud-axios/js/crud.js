const d = document,
  $table = d.getElementById("crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await axios.get("http://localhost:5000/santos"),
      json = await res.data;

    json.forEach((element) => {
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

    console.log(json);
  } catch (err) {
    let message = err.status || "Ocurrio un error";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>${err.status}: ${message}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async (e) => {
  if (e.target == $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //create -POST

      try {
        let options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          data: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value,
          }),
        };

        let res = await axios("http://localhost:5000/santos", options),
          json = await res.data;
        location.reload();

        //
      } catch (err) {
        let message = err.status || "Ocurrio un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>${err.status}: ${message}</b></p>`
        );
      }
    } else {
      //update- PUT

      try {
        let options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          data: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value,
          }),
        };

        let res = await axios(
            `http://localhost:5000/santos/${e.target.id.value}`,
            options
          ),
          json = await res.data;
        location.reload();

        //
      } catch (err) {
        let message = err.status || "Ocurrio un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>${err.status}: ${message}</b></p>`
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
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
      //delete DELETE

      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        };

        let res = await axios(
            `http://localhost:5000/santos/${e.target.dataset.id}`,
            options
          ),
          json = await res.data;
        location.reload();

        //
      } catch (err) {
        let message = err.status || "Ocurrio un error";
        alert(`Error: ${err.status}: ${message}`);
      }
    }
  }
});

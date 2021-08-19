import STRIPE_KEYS from "./stripe-keys.js";

const d = document,
  $tacos = d.getElementById("tacos"),
  $template = d.getElementById("taco-template").content,
  $fragment = d.createDocumentFragment(),
  fetchOptions = {
    headers: {
      Authorization: `Bearer ${STRIPE_KEYS.secret}`,
    },
  };

let prices, products;

const moneyFormat = (num) => `$${num.slice(0, -2)}.${num.slice(-2)}`;

Promise.all([
  fetch("https://api.stripe.com/v1/products", fetchOptions),
  fetch("https://api.stripe.com/v1/prices", fetchOptions),
])
  .then((responces) => {
    return Promise.all(
      responces.map((res) => {
        return res.json();
      })
    );
  })
  .then((json) => {
    products = json[0].data;
    prices = json[1].data;
    console.log(prices, products);

    prices.forEach((el) => {
      let productData = products.filter((product) => product.id === el.product);
      console.log(productData);

      $template.querySelector(".taco").setAttribute("data-price", el.id);
      $template.querySelector("img").src = productData[0].images[0];
      $template.querySelector("img").alt = productData[0].name;
      $template.querySelector("figcaption").innerHTML = `      
      ${productData[0].name}
      <br/>
      ${moneyFormat(el.unit_amount_decimal)} ${el.currency}

      `;
      let $clone = d.importNode($template, true);

      $fragment.appendChild($clone);
    });

    $tacos.appendChild($fragment);
  })
  .catch((err) => {
    console.log(err);
    let message = err.statusText || "Ocurrio un Error al conectarce a la API";

    $tacos.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  });

d.addEventListener("click", (e) => {
  if (e.target.matches(".taco *")) {
    let price = e.target.parentElement.getAttribute("data-price");

    Stripe(STRIPE_KEYS.public)
      .redirectToCheckout({
        lineItems: [{ price: price, quantity: 1 }],
        mode: "subscription",
        successUrl: "http://127.0.0.1:5500/assets/stripe-succes.html",
        cancelUrl: "http://127.0.0.1:5500/assets/stripe-cancel.html",
      })
      .then((res) => {
        if (res.error) {
          $tacos.insertAdjacentHTML("afterend", res.error.message);
        }
      });
  }
});

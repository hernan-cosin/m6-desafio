import { Router } from "@vaadin/router";

const outlet = document.querySelector(".root");
const router = new Router(outlet);
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/name", component: "name-page" },
  { path: "/users/:user", component: "x-user-profile" },
]);

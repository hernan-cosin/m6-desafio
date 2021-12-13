import { Router } from "@vaadin/router";

const outlet = document.querySelector(".root");
const router = new Router(outlet);
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/name", component: "name-page" },
  { path: "/code", component: "code-page" },
  { path: "/room", component: "room-page" },
  { path: "/press-play", component: "press-play-page" },
  { path: "/waiting-room", component: "waiting-room-page" },
]);

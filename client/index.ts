import { initButtom } from "./components/button";
import { initFormName } from "./components/form-name";
import { initPlay } from "./components/jugada";
import { initText } from "./components/text";
import "./pages/home";
import "./pages/name";
import "./router";

function main() {
  initButtom();
  initText();
  initPlay();
  initFormName();
}

main();

import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

import { effect, reative, toRefs, proxyRefs, computed } from "@vue/reactivity";

const content = document.getElementById("content")!;

const user = reative({ name: "111", age: 18 });

const c = computed({
  get: (oldev) => {
    console.log("runner");

    const r = `名字` + user.name;
    return r;
  },
  set: () => {},
});

effect(() => {
  console.log(c.value);
  console.log(c.value);
  console.log(c.value);
});

setTimeout(() => {
  // debugger;
  user.name = "wlt";
}, 1500);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

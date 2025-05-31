import dts from "bun-plugin-dts";

import "./src/index";
await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	target: "browser",
	format: "esm",
	splitting: true,
	plugins: [dts()],
});

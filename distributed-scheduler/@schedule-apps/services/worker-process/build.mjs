import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./dist",
	target: "bun",
	plugins: [dts()],
});

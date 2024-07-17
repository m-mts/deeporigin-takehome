import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/index.ts', './src/schedule.ts', './src/user.ts'],
  outdir: './dist',
  target: 'bun',
  plugins: [
    dts()
  ],
})
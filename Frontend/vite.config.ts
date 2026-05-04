/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react-swc'

import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import babel from 'vite-plugin-babel'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  let outDir = 'dist'

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [`process.env.${key}`]: `"${val}"`,
      }
    },
    {}
  )

  if (command === 'build' && /(dev|qa|stage)/.test(mode)) {
    outDir = `dist-${mode}`
  }

  return {
    plugins: [
      react(),
      babel({
        babelConfig: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      svgr(),
    ],
    base: env.VITE_ROUTER_BASE_PATH,
    resolve: {
      alias: [
        { find: '@project', replacement: path.resolve(__dirname, 'src') },
      ],
    },
    server: {
      host: 'localhost',
      port: parseInt(env.VITE_PORT, 10),
      fs: {
        allow: ['..'],
      },
    },
    build: {
      outDir,
    },
    define: envWithProcessPrefix,
  }
})

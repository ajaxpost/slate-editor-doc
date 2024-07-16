import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
// import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';

console.log(terser, 'terser');
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
function getPlugins() {
  return [
    peerDepsExternal(),
    commonjs(),
    resolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    typescript({
      clean: true, // 每次重启构建时清空输出目录
      check: true, // 如果为 true，则执行 TypeScript 类型检查。这可以帮助你发现代码中的类型错误。
      abortOnError: false, // 如果为 false，则即使 TypeScript 类型检查失败，也不会中止构建过程。
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: isProd ? './dist/types' : undefined,
        },
      },
    }),
    postcss({
      extract: true,
    }),
    isProd && terser(),
  ];
}

/**
 * @type {import('rollup').RollupOptions}
 */
export function createRollupConfig(pkg) {
  return [
    {
      input: './src/index.ts',
      output: [
        {
          format: 'es',
          sourcemap: isDev,
          file: `./${pkg.module}`,
          exports: 'auto',
        },
      ],
      plugins: getPlugins(),
    },
  ];
}

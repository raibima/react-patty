import swc from 'rollup-plugin-swc';
import {terser} from 'rollup-plugin-terser';
import prettier from 'rollup-plugin-prettier';
import replace from '@rollup/plugin-replace';
import bundlesize from 'rollup-plugin-bundle-size';

const inputs = ['index.ts', 'sync.tsx', 'async.tsx'];
const buildTypes = ['development', 'production', 'production.min'];

/** @type import('rollup').RollupOptions[] */
const config = [];
for (const input of inputs) {
  for (const buildType of buildTypes) {
    config.push({
      input: `src/${input}`,
      plugins: [
        replace({
          __DEV__: JSON.stringify(buildType === 'development'),
          preventAssignment: true,
        }),
        swc({
          env: {
            targets: '> 0.75%',
            loose: true,
          },
        }),
        buildType !== 'development' && terser(),
        buildType !== 'development' && terser(),
        buildType === 'production' && prettier({parser: 'typescript'}),
        buildType === 'production.min' && bundlesize(),
      ].filter(Boolean),
      output: {
        file: `dist/${input.replace(/\.tsx?$/, '')}.${buildType}.js`,
        format: 'cjs',
        interop: false,
        esModule: false,
      },
      external: 'react',
    });
  }
}

export default config;

const esbuild = require('esbuild');

const sharedConfig = {
  entryPoints: ['./src/index.ts', './src/sync.tsx', './src/async.tsx'],
  outdir: './dist',
  bundle: true,
  external: ['react'],
  format: 'cjs',
  target: ['chrome91', 'firefox90', 'safari14.1'],
};

esbuild
  .build({
    ...sharedConfig,
    entryNames: '[dir]/[name].development',
    define: {
      __DEV__: JSON.stringify(true),
    },
    minify: false,
  })
  .then(() => {
    console.log('DEVELOPMENT BUILD DONE');
  })
  .catch((err) => {
    console.error(err);
  });

esbuild
  .build({
    ...sharedConfig,
    entryNames: '[dir]/[name].production',
    define: {
      __DEV__: JSON.stringify(false),
    },
    minify: true,
    metafile: true,
  })
  .then((result) => {
    console.log('PRODUCTION BUILD DONE');
    return esbuild.analyzeMetafile(result.metafile);
  })
  .then((stats) => {
    console.log(stats);
  })
  .catch((err) => {
    console.error(err);
  });

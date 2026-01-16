/* eslint-disable import-x/no-extraneous-dependencies */
import copy from 'rollup-plugin-copy';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: ['./foundation.ts', './OscdSclDialogs.ts', './oscd-scl-dialogs.ts'],
    output: {
      sourcemap: true, // Add source map to build output
      format: 'es', // ES module type export
      dir: 'dist', // The build output folder
      // preserveModules: true,  // Keep directory structure and files
    },
    preserveEntrySignatures: 'strict', // leaves export of the plugin entry point

    plugins: [
      /** Resolve bare module imports */
      nodeResolve(),
      typescript(),
      importMetaAssets(),
      copy({
        targets: [{ src: 'ace', dest: 'dist' }],
      }),
    ],
  },
  {
    input: ['./wizards/wizards.ts'],
    output: {
      sourcemap: true, // Add source map to build output
      format: 'es', // ES module type export
      dir: 'dist', // The build output folder
      preserveModules: true, // Keep directory structure and files
    },
    preserveEntrySignatures: 'strict', // leaves export of the plugin entry point

    plugins: [
      /** Resolve bare module imports */
      nodeResolve(),
      typescript(),
      importMetaAssets(),
    ],
  },
];

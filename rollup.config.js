import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

export default
{
    input: 'src/server.ts',
    output: {
        file: pkg.module,
        format: 'es'
    },
    plugins: [
        commonjs(),
        json(),
        typescript({ tsconfig: './tsconfig.json' }),
        resolve({ jsnext: true })
    ],
    external: ['fsevents']
};

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default [
    // UMD build for browsers
    {
        input: 'src/index.js',
        output: {
            name: 'ZephyrDB',
            file: 'dist/zephyr-db.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            nodeResolve({
                browser: true
            })
        ]
    },
    // Minified UMD build
    {
        input: 'src/index.js',
        output: {
            name: 'ZephyrDB',
            file: 'dist/zephyr-db.min.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            nodeResolve({
                browser: true
            }),
            terser()
        ]
    },
    // ES module build
    {
        input: 'src/index.js',
        output: {
            file: 'dist/zephyr-db.esm.js',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            ...(production ? [terser()] : [])
        ]
    }
];

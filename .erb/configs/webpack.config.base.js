/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as baseExternals } from '../../src/package.json';

let externals = [...Object.keys(baseExternals || {})];

const optionalDependenciesOnMac = ['fsevents'];

// fsevents is only applied on macOS
if (process.platform === 'darwin') {
  externals = [...externals, ...optionalDependenciesOnMac];
}

export default {
  externals,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(js|jsx|tsx|ts)?$/,
        include: /node_modules/,
        use: ['react-hot-loader/webpack'],
      },
    ],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
    // Currently, module alias is only available in renderer processes
    // To do:: Fix issue that module alias is not applied on main process
    alias: {
      '@components': 'app/components',
      '@config': 'app/config',
      '@constants': 'app/constants',
      '@containers': 'app/containers',
      '@helper': 'app/helper',
      '@hooks': 'app/hooks',
      '@ipc': 'app/ipc',
      '@navigator': 'app/navigator',
      '@redux': 'app/redux',
      '@store': 'app/store',
      '@utils': 'app/utils',
      '@windows': 'app/windows',
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

/* eslint-disable object-curly-newline */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = (env, options) => {
  return {
    entry: ['react-hot-loader/patch', './src/front-end'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: 'file-loader' }],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: { native: false },
            },
          ],
        },
      ],
    },
    resolve: { extensions: ['.js', '.jsx'] },
    devServer: {
      contentBase: './dist',
      hot: true,
      historyApiFallback: true,
      port: 8080,
      proxy: {
        '/api/**': {
          target: 'http://localhost:5000',
          secure: false,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.mode),
      }),
      new WebpackPwaManifest({
        name: 'Dingen. Shop slim.',
        short_name: 'Dingen.',
        description: 'Beschrijving',
        background_color: '#F1F6FA',
        theme_color: '#44C062',
        crossorigin: 'use-credentials', // can be null, use-credentials or anonymous
        icons: [
          {
            src: path.resolve('src/front-end/assets/icon.png'),
            sizes: [192], // multiple sizes
          },
        ],
      }),
      new HtmlWebpackPlugin({ template: './index.html' }),
      new LodashModuleReplacementPlugin(),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
      new WorkboxPlugin.GenerateSW({
        // Do not precache images
        exclude: [/\.(?:png|jpg|jpeg|svg)$/],

        // Define runtime caching rules.
        runtimeCaching: [
          {
            // Match any request that ends with .png, .jpg, .jpeg or .svg.
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

            // Apply a cache-first strategy.
            handler: 'CacheFirst',

            options: {
              // Use a custom cache name.
              cacheName: 'images',

              // Only cache 10 images.
              expiration: { maxEntries: 10 },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 5000000,
      }),
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};

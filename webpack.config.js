const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');


const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production';
console.log(devMode)

const config = {
  // Tells Webpack which built-in optimizations to use
  // In 'production' mode, Webpack will minify and uglify our JS code
  // If you leave this out, Webpack will default to 'production'
  mode: devMode ? 'development' : 'production',
  // Webpack needs to know where to start the bundling process,
  // so we define the main JS and Sass files, both under
  // the './src' directory
  entry: ['./src/scripts/main.js', './src/styles/main.scss', './src/index.html'],
  // This is where we define the path where Webpack will place
  // the bundled JS file
  output: {
    path: devMode ? path.resolve(__dirname, 'public') : path.resolve(__dirname, 'dist'),
    // Specify the base path for all the assets within your
    // application. This is relative to the output path, so in
    // our case it will be ./public/assets
    publicPath: '',
    // The name of the output bundle. Path is also relative
    // to the output path
    filename: '[hash].js'
  },
  devtool: false,
  module: {
    // Array of rules that tells Webpack how the modules (output)
    // will be created
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        // Look for JavaScript files and apply the babel-loader
        // excluding the './node_modules' directory. It uses the
        // configuration in `.babelrc`
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        // Look for Sass files and process them according to the
        // rules specified in the different loaders
        test: /\.(sa|sc)ss$/,
        // Use the following loaders from right-to-left, so it will
        // use sass-loader first and ending with MiniCssExtractPlugin
        use: [
          {
            // Extracts the CSS into a separate file and uses the
            // defined configurations in the 'plugins' section
            loader: MiniCssExtractPlugin.loader
          },
          {
            // Interprets CSS
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            // Use PostCSS to minify and autoprefix. This loader
            // uses the configuration in `postcss.config.js`
            loader: 'postcss-loader'
          },
          {
            // Adds support for Sass files, if using Less, then
            // use the less-loader
            loader: 'sass-loader'
          }
        ]
      },
      {
        // Adds support to load images in your CSS rules. It looks
        // for .png, .jpg, .jpeg and .gif
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // The image will be named with the original name and
              // extension
              name(file) {
                return '[hash].[ext]';
              },
              // Indicates where the images are stored and will use
              // this path when generating the CSS files.
              // Example, in main.scss I have
              // url('../../public/assets/images/venice-italy.jpg')
              // and when generating the CSS file, it will be
              // outputted as url(../images/venice-italy.jpg), which
              // is relative to /styles/main.css
              // publicPath: 'images',
              // When this option is 'true', the loader will emit
              // the image to output.path
              emitFile: true,
              outputPath: ''
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Configuration options for MiniCssExtractPlugin. Here I'm only
    // indicating what the CSS outputted file name should be and
    // the location
    new MiniCssExtractPlugin({
      filename: '[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

module.exports = (env, argv) => {
  if (devMode) {
    config.plugins.push(
        new webpack.SourceMapDevToolPlugin({
      filename: '[hash].js.map'
    }))
  }
  return config
}
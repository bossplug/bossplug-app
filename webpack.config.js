var webpack = require('webpack');
var path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var environment = process.env.NODE_ENV || 'development';

/*
var htmlPlugin = new HtmlWebpackPlugin({
      title: '0xBitcoin',
     filename: 'index.html',
      template: 'app/index.html',
});
*/
var extractPlugin = new ExtractTextPlugin({
   filename: 'assets/main.css'
});


var webpackPlugins = [
    extractPlugin,
    new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new CopyWebpackPlugin([
            {from:'app/assets/img',to:'assets/img'}
        ])
]



const routesData = {
  routes: [
    {url: '/', title: 'Lava Wallet', template: 'app/index.html', filename: 'index.html'},
    {url: '/accounts', title: 'Accounts', template: 'app/accounts.html', filename: 'accounts.html'},
    {url: '/transfer', title: 'Transfer', template: 'app/transfer.html', filename: 'transfer.html'},
    {url: '/account_add', title: 'Add Account', template: 'app/account_add.html', filename: 'account_add.html'},
    {url: '/account_new', title: 'New Account', template: 'app/account_new.html', filename: 'account_new.html'},
    {url: '/account_import', title: 'Import Account', template: 'app/account_import.html', filename: 'account_import.html'},
    {url: '/settings', title: 'Settings', template: 'app/settings.html', filename: 'settings.html'},
    {url: '/addressbook', title: 'Address Book', template: 'app/addressbook.html', filename: 'addressbook.html'}
   ]
}


routesData.routes.forEach(function(element){

  var htmlPlugin = new HtmlWebpackPlugin({
        title: element.title,
        filename: element.filename,
        template: element.template
  });

 webpackPlugins.push(htmlPlugin)

})



module.exports = {
    entry: [
      './app/assets/javascripts/index',
      './app/assets/stylesheets/application.scss'
   ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader', 
                        options: {
                            presets: ['es2016']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: extractPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
              test: /\.(png|jpg|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[path][name].[ext]',
                     publicPath: '/',
                  }
                }
              ]
            },

            {
              test: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[path][name].[ext]',
                     publicPath: '../',
                  }
                }
              ]
            },
        ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      }
    },
    plugins: webpackPlugins
};

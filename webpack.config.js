const htmlwebpackplugin = require('html-webpack-plugin');
const extracttextwebpackplugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        app: "./app/entry",
        vendors: ['vue','vue-router','vue-resource','element-ui']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath:'/assets/img',
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                // options for the loader
                options: {compact: false}
            },
            {
                test: /\.css$/,
                /*use:extracttextwebpackplugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),*/
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(woff|ttf|eot|svg|png)$/,
                /*use:extracttextwebpackplugin.extract({
                 fallback: "style-loader",
                 use: "css-loader"
                 }),*/
                loader: "url-loader"
            },
            {
                test: /\.vue?$/,
                loader: "vue-loader",
                options:{
                    loaders: {
                        css: extracttextwebpackplugin.extract({fallback:'style-loader',use:'css-loader'})
                    }
                }
            },
        ],
    },

    devtool: "source-map",
    plugins: [
        new htmlwebpackplugin({
            title: 'My App',
            filename: 'index.html',
            template: 'app/index.html'
        }),
        new extracttextwebpackplugin({
            filename:'main.css',
            allChunks:true
        }),
        new webpack.optimize.CommonsChunkPlugin({name:'vendors',filename:'vendors.js'}),
        //new webpack.optimize.UglifyJsPlugin()
    ],
}
var version = require('./package').version;

var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}});

var path = require('path');

var configPlugin = new webpack.DefinePlugin({
    "process.env": {
        VERSION: JSON.stringify(version),
        NODE_ENV: process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : JSON.stringify("development")
    }
});

var publicPath;
var plugins = [ configPlugin];

if (process.env.NODE_ENV === "production") {
    publicPath = "http://s1.zhgtrade.com/static/js/market/"
    plugins.push(uglifyJsPlugin)
} else {
    publicPath = "/static/js/market/"
}

module.exports = {
    entry: {
        'trade': './js/market/trade.js',
    },
    output: {
        path: `${version}/`,
        //publicPath: `/static/js/`,
		publicPath: publicPath,
		    //publicPath: `http://localhost:3000/1.0.0/`,
        filename: '[name].js'
    },
    externals: {
        // 'react': 'React',
        // 'react-dom': 'ReactDOM',
        'window': 'window',
    },
    resolve: {
        alias: {
          'socket.io': path.join(__dirname, 'js/lib/socket.io.min'),
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['react', 'es2015']
                }
            },
        ]

    },
    plugins: plugins
    // plugins: [commonsPlugin, configPlugin]
};

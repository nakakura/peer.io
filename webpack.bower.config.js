var webpack = require('webpack')
    , path = require('path')
    , _entry = {}
    , _devtool = ""
    , _output = {}
    , _port = 8080;

var tests = require('./helper/tests');

module.exports = {
    cache: true,
    entry: {
        'peer.io': [
            './bower_components/offline/offline.min.js',
            './src/peer.io.ts'
        ]
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './dist/bower'),
        publicPath: "dist/bower",
        filename: '[name].js',
        library: "PeerIo",
        libraryTarget: "umd"
    },
    module: {
        noParse: [
            /sinon/
        ],
        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader'
            }, {
                test: /\.(js|jsx)?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            { test: /\.html$/, loader: 'raw-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.svg$/, loader: 'url-loader?mimetype=image/svg+xml' },
            { test: /\.woff$/, loader: 'url-loader?mimetype=application/font-woff' },
            { test: /\.woff2$/, loader: 'url-loader?mimetype=application/font-woff' },
            { test: /\.eot$/, loader: 'url-loader?mimetype=application/font-woff' },
            { test: /\.ttf$/, loader: 'url-loader?mimetype=application/font-woff' }
        ],
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
            ),
            new webpack.ProvidePlugin({
                Offline: "offline-js"
            })
        ],
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    devServer: {
        quiet: true,
        https: true,
        inline: true,
        port: 8080,
        contentBase: "./"
    }
};

if (process.env.NODE_ENV === "develop") {
    tests.watch();
    console.log("start test");
}

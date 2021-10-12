const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const webpackConfig = {
    entry: {
        bundle: ['babel-polyfill', `${__dirname}/../../app/App.tsx`],
    },
    output: {
        path: path.resolve(__dirname, './../../../dist'),
        filename: 'js/[name].js',
        publicPath: `/familie/sykdom-i-familien/soknad/omsorgspengerutbetaling-arbeidstaker/dist`,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
        alias: {
            app: path.resolve(__dirname, './../../app'),
            ['common']: path.resolve(__dirname, './../../../node_modules/@navikt/sif-common-core/lib'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            eslintPath: require.resolve('eslint'),
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(ts|tsx)$/,
                include: [path.resolve(__dirname, './../../app'), path.resolve(__dirname, './../../common')],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            experimentalFileCaching: false,
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                options: {},
            },
        ],
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css?[fullhash]-[chunkhash]-[name]',
            linkType: 'text/css',
        }),
        new SpriteLoaderPlugin({
            plainSprite: true,
        }),
    ],
};

module.exports = webpackConfig;

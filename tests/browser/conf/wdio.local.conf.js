'use strict';

let merge        = require( 'deepmerge' );
let wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl                   : 'http://opensquare-local.nyupress.org/open-square/search/',
    openSquareGoogleAnalytics : false,
} );

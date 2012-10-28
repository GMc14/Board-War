#!/usr/bin/env node

var YUI = require('yui').YUI;
YUI().use('json', function(Y) {
"use strict";

// options

var argv = require('optimist')
	.usage('usage: $0')
	.option('c',
	{
		alias:    'config',
		demand:   true,
		describe: 'Path to game configuration'
	})
	.option('p',
	{
		alias:    'port',
		default:  80,
		describe: 'Port to listen on'
	})
	.option('d',
	{
		alias:    'debug',
		boolean:  true,
		describe: 'Turn on debugging'
	})
	.argv;

var debug = argv.debug;
if (debug)
{
	require('long-stack-traces');
}

var mod_config  = require('./server/config.js');
var game_config = mod_config.load(argv.config);

// games

var mod_game = require('./server/game.js');
var games    = mod_game.init(game_config);

// server

var mod_server = require('./server/server.js');
var app        = mod_server.createApp(argv.p, game_config, games, debug);

var server = require('http').createServer(app);
server.listen(argv.p);

// sockets

var mod_io = require('socket.io'),
	io     = mod_io.listen(server);

io.set('log level', 1);

io.sockets.on('connection', function(socket)
{
	var ctx = {};

	mod_game.configureSocket(socket, game_config, games, ctx);
});

});

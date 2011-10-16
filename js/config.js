var YUI = require('yui3').YUI;
YUI().use('json', function(Y)
{

var fs = require('fs');

function string(
	/* string */ name,
	/* string */ data)
{
	var m = new RegExp('^' + name + '\\s*:\\s*(.*)$', 'm').exec(data);
	if (m && m.length)
	{
		return m[1];
	}
}

function number(
	/* string */ name,
	/* string */ data)
{
	var s = string(name, data);
	if (!Y.Lang.isUndefined(s))
	{
		return parseInt(s, 10);
	}
}

exports.load = function(
	/* string */ path)
{
	var config =
	{
		max_games: 10
	};

	// game

	var data = fs.readFileSync(path + '/game', 'utf-8');

	config.title = string('title', data);

	// player

	data = fs.readFileSync(path + '/player', 'utf-8');

	config.min_players = number('min', data);
	config.max_players = number('max', data);

	// board

	data = Y.Lang.trim(fs.readFileSync(path + '/board', 'utf-8')).split('\n');

	var board_type   = data[0];
	var board_layout = data[1];

	config.board =
	{
		
	};

	return config;
};

});
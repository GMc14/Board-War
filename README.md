Board War
=========

Game engine built on NodeJS that supports a diverse class of games
including TicTacToe, Monopoly, WizWar, and miniatures war gaming.

The engine is turn-based.  Each player starts with a basic set of abilities
and objects and obtains additional abilities, modifiers, and objects from a
pool.  The player's stats, abilities, modifiers, objects, pool behavior,
non-player characters, and victory conditions are all defined via
configuration and JavaScript code snippets.

The engine provides rudimentary chat capabilities for people using tablets.
Access to IM clients makes it hopeless to restrict in-game communication,
no matter how interesting it would be for game balance, so the engine does
not try to foster any illusions.

Installation
------------

Install nodejs >= 0.8.0 and npm and then run `npm install`.

Usage
-----

Start the server:

    cd Board-War
    node boardwar.js -c path-to-game-config [-p port] [-d]
    
    note: all game paths except 'squares' are currently missing img & css files 
Connect from the browser:

    http://server-uri/

Type your player name and press return, and you will enter the game.  The
first player is the admin who controls the player list and starts the game.

Code Organization
-----------------

    boardwar.js     Main server code
    client          Client modules
        admin.js    Code used only when player is the game admin
        board.js    Renders the game board
        game.js     Socket messages related to game management
    games           Sample game configurations
    server          Server modules
        boards.js   Initializes the game board
        config.js   Loads game configuration
        game.js     Socket messages related to game management
        server.js   Configures the Express web server
        util.js     Utility functions
    views           Client web pages
        boardwar.js The web page with which players interact

Data Structures
---------------

game_config stores all the configuration loaded from the game config
directory:

    title
    home_url        url to which players should be redirected after game is finished
    max_games       maximum number of simultaneous games to host
    min_players
    max_players
    board           array of elements on the board
    board_code      custom code for rendering board elements
    css             custom CSS styles for rendering the application
    images          map of images in img sub-directory: file name -> data: uri

The state for each game is stored in an object:

    ping            timestamp of last client message, for culling abandoned games
    running         true if the game has been started
    player          map of players
        id
        name
        admin       true if player is game admin
        socket

Since the code is broken up into modules, the Socket IO handlers cannot use
JavaScript closures to store session state.  Instead, everything is stored
in a ctx object.

On the server, ctx stores:

    game_id
    game        reference to object in games map
    player_id
    player      reference to object in game's player map

On the client, ctx stores:

    base_url        url of the server, used to start a game
    home_url        url to which players are redirected after a game is finished
    game_id
    player_name
    player_id
    admin           true if player is game admin
    game
        url         url to which players should connect, to join the game
        running     true if the game has been started
    player          reference to player map

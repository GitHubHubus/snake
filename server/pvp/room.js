'use strict';

const create = (id, countPlayers = 2) => {
    return {
        countPlayers: countPlayers,
        players: [],
        id: id
    };
}

exports.create = create;

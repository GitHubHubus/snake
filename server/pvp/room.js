'use strict';

const create = (id) => {
    return {
        countPlayers: 2,
        players: [],
        id: id
    };
}

exports.create = create;

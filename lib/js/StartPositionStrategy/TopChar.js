class TopChar {
    get (params) {
        return {
            'x': parseInt(Math.random() * params.width) + params.x,
            'y': params.y - 5
        }
    }
}
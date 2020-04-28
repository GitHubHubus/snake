class LeftChar {
    get (params) {
        return {
            'x': params.x,
            'y': parseInt(Math.random() * 5) + (params.y - 5)
        }
    }
}
class BottomChar {
    getPosition (params) {
        return {
            'x': parseInt(Math.random() * params.width) + params.x,
            'y': params.y
        }
    }
}
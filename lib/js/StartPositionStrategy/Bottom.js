class Bottom {
    getPosition (params) {
        return {
            'x': parseInt(Math.random() * params.width) + params.x,
            'y': params.max.y
        }
    }
}
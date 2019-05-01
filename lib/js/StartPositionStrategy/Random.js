class Random {
    getPosition (params) {
        return {
            'x': parseInt(Math.random() * params.max.x),
            'y': parseInt(Math.random() * params.max.y)
        }
    }
}
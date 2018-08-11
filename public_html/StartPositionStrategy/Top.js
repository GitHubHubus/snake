class Top {
    getPosition (params) {
        return {
            'x': parseInt(Math.random() * params.width) + params.x,
            'y': 0
        }
    }
}
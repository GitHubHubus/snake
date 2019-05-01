class Right {
    get (params) {
        return {
            'x': params.max.x,
            'y': parseInt(Math.random() * 5) + params.y - 5
        }
    }
}
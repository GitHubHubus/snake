class Left {
    get (params) {
        return {
            'x': 0,
            'y': parseInt(Math.random() * 5) + (params.y - 5)
        }
    }
}
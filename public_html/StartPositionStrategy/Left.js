class Left {
    getPosition (params) {
        return {
            'x': 0,
            'y': parseInt(Math.random() * 5) + (params.y - 5)
        }
    }
}
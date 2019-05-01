class RightChar {
    getPosition (params) {
        return {
            'x': params.x + params.width,
            'y': parseInt(Math.random() * 5) + (params.y - 5)
        }
    }
}
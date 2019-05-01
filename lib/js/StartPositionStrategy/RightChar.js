class RightChar {
    get (params) {
        return {
            'x': params.x + params.width,
            'y': parseInt(Math.random() * 5) + (params.y - 5)
        }
    }
}
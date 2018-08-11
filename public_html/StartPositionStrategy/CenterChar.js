class CenterChar {
    getPosition (params) {
        return {
            'x': params.x + parseInt(params.width/2),
            'y': params.y - 3
        }
    }
}
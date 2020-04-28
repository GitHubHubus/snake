class Center {
    get (params) {
        return {
            'x': parseInt(params.max.x/2),
            'y': parseInt(params.max.y/2)
        }
    }
}
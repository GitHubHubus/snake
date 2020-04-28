export default class Random {
    get (params) {
        return {
            'x': parseInt(Math.random() * params.max.x),
            'y': parseInt(Math.random() * params.max.y)
        }
    }
}
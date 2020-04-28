export default class EventHelper {
    /**
     * @param {String} type
     * @param {Object} params
     */
    static fire(type, params = {}) {
        let event = new Event(type);
        
        for (var prop in params) {
            event[prop] = params[prop];
        }

        document.dispatchEvent(event);
    }
}
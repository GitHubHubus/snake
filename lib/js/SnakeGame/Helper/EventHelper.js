class EventHelper {
    static fire(type, params) {
        params = params || {};
        let event = new Event(type);
        
        for (var prop in params) {
            event[prop] = params[prop];
        }

        document.dispatchEvent(event);
    }
}
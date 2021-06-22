import Event from './_Event';

/**
 * Коллекция параметров события.
 */
type Params = Omit<Event, 'name' | 'sessionId'>;

export default Params;

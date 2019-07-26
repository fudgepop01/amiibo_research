import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import data from './db_base.js';

const adapter = new LocalStorage('db.json');
const db = low(adapter);

db.setState(data);

export default db;
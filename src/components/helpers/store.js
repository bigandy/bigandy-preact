import idb from 'idb';

const store = {
	db: null,

	init: function(type) {
		if (this.db) {
			return Promise.resolve(this.db);
		}

		return idb.open(`${type}-store`, 1, (upgradeDB) => {
			upgradeDB.createObjectStore(type, { autoIncrement : true, keyPath: 'id' });
		}).then((db) => {
			return this.db = db;
		});
	},

	outbox: function(type, mode) {
		return this.init(type).then((db) => {
			return db.transaction(type, mode).objectStore(type);
		});
	}
};

export default store;

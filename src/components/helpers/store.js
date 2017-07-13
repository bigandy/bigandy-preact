import idb from 'idb';

const store = {
	db: null,

	init() {
		if (this.db) {
			return Promise.resolve(this.db);
		}

		return idb.open('post-page-store', 1, (upgradeDB) => {
			upgradeDB.createObjectStore('post-page-store', { autoIncrement : true, keyPath: 'id' });
		}).then((db) => {
			return this.db = db;
		});
	},

	outbox(mode) {
		return this.init('post-page-store')
			.then((db) => {
				return db.transaction('post-page-store', mode).objectStore('post-page-store');
			});
	}
};

export default store;

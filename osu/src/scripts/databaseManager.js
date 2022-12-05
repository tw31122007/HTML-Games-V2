	class StoragePair {
		constructor(name, data) {
			this.name = name;
			this.data = data;
		}
	}
export function getObjectStore(database, store, mode) {
	let transaction = database.transaction(store, mode);
	return transaction.objectStore(store);
}
export function addToDatabase(database, store, key, data) {
	let object = new StoragePair(key, data);
	let objectStore = this.getObjectStore(database, store, "readwrite");
	let request = objectStore.put(object);
	request.addEventListener("error", function(event) {
		console.error(`Attempt to insert into object store ${store} failed: ${event.target.error}`);
	});
}
export function getAllInDatabase(database, store, asyncReturns) {
	let objectStore = this.getObjectStore(database, store, "readonly");
	let request = objectStore.openCursor();
	request.addEventListener("error", function(event) {
		console.error(`Attempt to fetch data from object store ${store} failed: ${event.target.error}`);
	});
	request.addEventListener("success", function(event) {
		let cursor = event.target.result;
		if (cursor) {
			let value = cursor.value;
			asyncReturns.values.push(value);
			cursor.continue();
		} else {
			asyncReturns.complete = true;
			asyncReturns.onComplete();
		}
	});
}
export function add(databaseName, data, objectStore) {
	let self = this;
	let database = indexedDB.open(databaseName);
	database.addEventListener("error", function(event) {
		console.error(`Attempt to open database failed: ${event.target.error}`);
	});
	database.addEventListener("success", function(event) {
		let database = event.target.result;
		self.addToDatabase(database, objectStore, data.name, data.data);
	});
}
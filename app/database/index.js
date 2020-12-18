import localforage from 'localforage';

const localDB = localforage.createInstance({
	name: 'body record app',
});

export default localDB;

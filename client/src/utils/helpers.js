export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('shop-shop', 1)

    let db, tx, store
    // if version has changed (or if this is the first time using the database), run this method and create the three object stores 
    request.onupgradeneeded = function (e) {
      const db = request.result
      db.createObjectStore('products', { keyPath: '_id' })
      db.createObjectStore('categories', { keyPath: '_id' })
      db.createObjectStore('cart', { keyPath: '_id' })
    }
    request.onerror = function (e) {
      console.log('theres s and error up in here')
    }
    request.onsuccess = function (e) {
      // save a reference of the database to the `db` variable
      db = request.result;
      // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
      tx = db.transaction(storeName, 'readwrite')
      store = tx.objectStore(storeName)

      switch (method) {
        case 'put':

          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }
      tx.oncomplete = function () {
        db.close()
      }
    }
  })
}
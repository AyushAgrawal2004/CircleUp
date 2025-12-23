const DB_NAME = "StatusMusicDB";
const DB_VERSION = 1;
const STORE_NAME = "audio";

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject("Error opening database");
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
    });
};

export const saveAudio = async (file) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // Create a unique ID for the file
        const id = `local-${Date.now()}-${file.name}`;

        const request = store.put({ id, file });

        request.onsuccess = () => {
            resolve(id);
        };

        request.onerror = (event) => {
            reject("Error saving file to DB");
        };
    });
};

export const getAudio = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        if (!id) return resolve(null);

        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = (event) => {
            const result = event.target.result;
            resolve(result ? result.file : null);
        };

        request.onerror = (event) => {
            reject("Error retrieving file from DB");
        };
    });
};

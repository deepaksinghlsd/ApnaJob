import { openDB } from 'idb';

const DB_NAME = 'ApnaJobDB';
const DB_VERSION = 1;

/**
 * Initializes the IndexedDB for storing external jobs and bookmarks.
 */
export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Store for external jobs fetched from Tavily
            if (!db.objectStoreNames.contains('external-jobs')) {
                db.createObjectStore('external-jobs', { keyPath: 'url' });
            }
            // Store for user bookmarks/saved jobs
            if (!db.objectStoreNames.contains('bookmarks')) {
                db.createObjectStore('bookmarks', { keyPath: 'url' });
            }
        },
    });
};

/**
 * Saves a list of external jobs to the cache.
 */
export const saveExternalJobs = async (jobs) => {
    const db = await initDB();
    const tx = db.transaction('external-jobs', 'readwrite');
    const store = tx.objectStore('external-jobs');
    for (const job of jobs) {
        await store.put({
            ...job,
            cachedAt: Date.now()
        });
    }
    await tx.done;
};

/**
 * Retrieves all cached external jobs.
 */
export const getCachedExternalJobs = async () => {
    const db = await initDB();
    return db.getAll('external-jobs');
};

/**
 * Clears the external jobs cache.
 */
export const clearExternalJobsCache = async () => {
    const db = await initDB();
    await db.clear('external-jobs');
};

/**
 * Bookmarks a job (local only initially).
 */
export const toggleBookmark = async (job) => {
    const db = await initDB();
    const bookmark = await db.get('bookmarks', job.url);
    if (bookmark) {
        await db.delete('bookmarks', job.url);
        return false; // Removed
    } else {
        await db.put('bookmarks', job.url, { ...job, bookmarkedAt: Date.now() });
        return true; // Added
    }
};

/**
 * Checks if a job is bookmarked.
 */
export const isBookmarked = async (url) => {
    const db = await initDB();
    const res = await db.get('bookmarks', url);
    return !!res;
};

/**
 * Retrieves all bookmarked jobs.
 */
export const getAllBookmarks = async () => {
    const db = await initDB();
    return db.getAll('bookmarks');
};

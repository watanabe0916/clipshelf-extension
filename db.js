/* global Dexie */

const clipShelfDB = new Dexie('ClipShelfDB');

clipShelfDB.version(1).stores({
    screenshots: '++id, groupId, imageBlob, pageUrl, timestamp',
});

// nameを追加したバージョン2を定義
clipShelfDB.version(2).stores({
    screenshots: '++id, groupId, imageBlob, pageUrl, timestamp, name',
});

async function addScreenshot(record) {
    return clipShelfDB.table('screenshots').add(record);
}

async function getScreenshotsByGroup(groupId) {
    const rows = await clipShelfDB.table('screenshots').where('groupId').equals(groupId).toArray();
    return rows.sort((a, b) => b.timestamp - a.timestamp);
}

async function deleteScreenshotById(id) {
    return clipShelfDB.table('screenshots').delete(id);
}

async function deleteScreenshotsByGroup(groupId) {
    return clipShelfDB.table('screenshots').where('groupId').equals(groupId).delete();
}

async function getScreenshotCountsByGroupIds(groupIds) {
    const counts = {};
    if (!Array.isArray(groupIds) || groupIds.length === 0) {
        return counts;
    }

    const rows = await clipShelfDB.table('screenshots').where('groupId').anyOf(groupIds).toArray();
    rows.forEach((row) => {
        const groupId = row.groupId;
        counts[groupId] = (counts[groupId] || 0) + 1;
    });

    return counts;
}

async function getTotalScreenshotCount() {
    return clipShelfDB.table('screenshots').count();
}

self.ClipShelfDB = {
    db: clipShelfDB,
    addScreenshot,
    getScreenshotsByGroup,
    deleteScreenshotById,
    deleteScreenshotsByGroup,
    getScreenshotCountsByGroupIds,
    getTotalScreenshotCount,
};
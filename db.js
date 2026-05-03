/* global Dexie */

const clipShelfDB = new Dexie('ClipShelfDB');

clipShelfDB.version(4).stores({
    screenshots: '++id, groupId, [groupId+timestamp]',
});

async function addScreenshot(record) {
    return clipShelfDB.table('screenshots').add(record);
}

async function getScreenshotsByGroupPage(groupId, offset = 0, limit = 30) {
    return clipShelfDB
        .table('screenshots')
        .where('[groupId+timestamp]')
        .between([groupId, Dexie.minKey], [groupId, Dexie.maxKey])
        .reverse()
        .offset(Math.max(0, Number(offset) || 0))
        .limit(Math.max(1, Number(limit) || 30))
        .toArray();
}

async function deleteScreenshotById(id) {
    return clipShelfDB.table('screenshots').delete(id);
}

async function renameScreenshotById(id, name) {
    return clipShelfDB.table('screenshots').update(id, { name });
}

async function deleteScreenshotsByGroup(groupId) {
    return clipShelfDB.table('screenshots').where('groupId').equals(groupId).delete();
}

async function getScreenshotCountsByGroupIds(groupIds) {
    const counts = {};
    if (!Array.isArray(groupIds) || groupIds.length === 0) {
        return counts;
    }

    await Promise.all(
        groupIds.map(async (groupId) => {
            counts[groupId] = await clipShelfDB.table('screenshots').where('groupId').equals(groupId).count();
        }),
    );

    return counts;
}

async function getScreenshotCountByGroupId(groupId) {
    if (typeof groupId !== 'string' || groupId.trim() === '') {
        return 0;
    }

    return clipShelfDB.table('screenshots').where('groupId').equals(groupId).count();
}

async function getTotalScreenshotCount() {
    return clipShelfDB.table('screenshots').count();
}

self.ClipShelfDB = {
    db: clipShelfDB,
    addScreenshot,
    getScreenshotsByGroupPage,
    deleteScreenshotById,
    renameScreenshotById,
    deleteScreenshotsByGroup,
    getScreenshotCountsByGroupIds,
    getScreenshotCountByGroupId,
    getTotalScreenshotCount,
};

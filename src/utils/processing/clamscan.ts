import NodeClam from "clamscan"

const ClamScan = new NodeClam().init({
    removeInfected: false,
    quarantineInfected: false,
    debugMode: false,
    scanRecursively: true,
    clamscan: {
        path: '/usr/bin/clamscan',
        scanArchives: true,
        active: true
    },
    clamdscan: {
        socket: false,
        host: false,
        port: false,
        timeout: 60000,
        localFallback: false,
        path: '/usr/bin/clamdscan',
        multiscan: true,
        reloadDb: false,
        active: true,
        bypassTest: false,
    },
    preference: 'clamdscan'
});

export default ClamScan;
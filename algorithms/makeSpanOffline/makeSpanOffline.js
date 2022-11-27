function makespanNonPreStatic(processes, m) {
    const MX = 1e9;
    var burstTime = [];
    var finalSchedule = [];
    const n = processes.length;
    for (var i = 0; i < n; i += 1) {
        burstTime.push([processes[i].burstTime, processes[i].pId]);
    }
    burstTime.sort();
    burstTime.reverse();
    finalSchedule = [];
    var curTimeCore = [];
    for (var i = 0; i < m; i++) {
        curTimeCore.push(0);
    }
    for (var i = 0; i < m; i++) {
        finalSchedule.push([]);
    }
    for (var i = 0; i < n; i += 1) {
        finalSchedule[i % m].push({
            pId: burstTime[i][1],
            start: curTimeCore[i],
            end: curTimeCore[i] + burstTime[i][0],
        });
        curTimeCore[i] += burstTime[i][0];
    }
    return allocation;
}

function findMin(curTimeCore) {
    var ind = 0;
    var mn = 1e9;
    for (var i = 0; i < m; i += 1) {
        if (curTimeCore[i] < mn) {
            mn = curTimeCore[i];
            ind = i;
        }
    }
    return ind;
}

function makespanNonPreOnline(processes, m) {
    const MX = 1e9;
    var burstTime = [];
    var finalSchedule = [];
    for (var i = 0; i < n; i += 1) {
        burstTime.push([processes[i].burstTime, processes[i].pId]);
    }
    finalSchedule = [];
    var curTimeCore = [];
    for (var i = 0; i < m; i++) {
        curTimeCore.push(0);
    }
    for (var i = 0; i < m; i++) {
        finalSchedule.push([]);
    }
    for (var i = 0; i < n; i += 1) {
        var ind = findMin(curTimeCore);
        finalSchedule[ind % m].push({
            pId: burstTime[i][1],
            start: curTimeCore[i],
            end: curTimeCore[i] + burstTime[i][0],
        });
        curTimeCore[i] += burstTime[i][0];
    }
    return allocation;
}

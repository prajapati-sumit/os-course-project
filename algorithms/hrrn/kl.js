function findHRR(arrivalTime, burstTime, n, visited, curTime) {
    var mx = -1;
    var ans = -1;
    for (var i = 0; i < n; i += 1) {
        if (!visited[i] && arrivalTime[i] <= curTime) {
            var waitingTimeYet = curTime - arrivalTime[i];
            var hrr = (waitingTimeYet + burstTime[i]) / burstTime[i];
            if (hrr > mx) {
                mx = hrr;
                ans = i;
            }
        }
    }
    return ans;
}

function HRRN(processes) {
    var burstTime = [];
    var arrivalTime = [];
    var finalSchedule = [];
    const n = processes.length;
    for (var i = 0; i < n; i += 1) {
        burstTime.push(processes[i].burstTime);
    }
    for (var i = 0; i < n; i += 1) {
        arrivalTime.push(processes[i].arrivalTime);
    }

    schedule = [];
    var curTime = 0;
    var done = 0;
    visited = [];
    for (var i = 0; i < n; i += 1) {
        visited.push(0);
    }
    while (done < n) {
        var process = findHRR(arrivalTime, burstTime, n, visited, curTime);
        // console.log(process);
        if (process != -1) {
            schedule.push({
                pId: processes[process].pId,
                start: curTime,
                end: curTime + burstTime[process],
            });
            done += 1;
            curTime += burstTime[process];
            visited[process] = 1;
        } else {
            schedule.push({
                pId: -1,
                start: curTime,
                end: curTime + 1,
            });
            curTime += 1;
        }
    }
    var ptr = 0;
    while (ptr < schedule.length) {
        if (schedule[ptr].pId != -1) {
            finalSchedule.push(schedule[ptr]);
            ptr += 1;
            continue;
        }
        var total = 0;
        var o = ptr;
        while (ptr < schedule.length && schedule[ptr].pId == -1) {
            total += 1;
            ptr++;
        }
        finalSchedule.push({
            pId: -1,
            start: schedule[o].start,
            end: schedule[o].start + total,
        });
    }
    return finalSchedule;
}

processes = [];

for (var i = 0; i < 5; i++) {
    processes.push({
        pId: i,
        arrivalTime: 1 + Math.floor(Math.random() * 10),
        burstTime: 1 + Math.floor(Math.random() * 10),
    });
}
console.log(processes)
console.log(HRRN(processes))

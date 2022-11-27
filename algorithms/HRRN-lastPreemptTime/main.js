function find(burstTime, n, visited, curTime, lastPreemptTime, arrivalTime) {
    var mx = -1;
    var ans = -1;
    for (var i = 0; i <= n; i += 1) {
        if (!visited[i] && arrivalTime[i] <= curTime) {
            var metric = curTime - lastPreemptTime[i];
            var priority = (metric + burstTime[i]) / burstTime[i];
            if (priority > mx) {
                mx = priority;
                ans = i;
            }
        }
    }
    return ans;
}

function mergeProcesses(schedule) {
    var ptr = 0;
    var finalSchedule = [];
    while (ptr < schedule.length) {
        var start = ptr;
        var k = schedule[ptr].pId;
        var total = 0;
        while (ptr < schedule.length && schedule[ptr].pId == k) {
            total += 1;
            ptr += 1;
        }
        finalSchedule.push({
            pId: k,
            start: schedule[start].start,
            end: schedule[start].start + total,
        });
    }
    return finalSchedule;
}

function lastPreemptTime(processes) {
    var burstTime = [];
    var arrivalTime = [];
    var finalSchedule = [];
    var lastPreemptTime = [];
    const n = processes.length;
    for (var i = 0; i < n; i += 1) {
        burstTime.push(processes[i].burstTime);
        arrivalTime.push(processes[i].arrivalTime);
        lastPreemptTime.push(processes[i].arrivalTime);
    }

    var schedule = [];
    var curTime = 0;
    var done = 0;
    var visited = [];
    var completed = [];

    for (var i = 0; i < n; i += 1) {
        visited.push(0);
        completed.push(0);
    }
    while (done < n) {
        var process = find(
            burstTime,
            n,
            visited,
            curTime,
            lastPreemptTime,
            arrivalTime
        );

        if (process != -1) {
            schedule.push({
                pId: process,
                start: curTime,
                end: curTime + 1,
            });
            completed[process] += 1;
            if (completed[process] == burstTime[process]) {
                done += 1;
                visited[process] = 1;
            }
            if (schedule.length > 0) {
                var lastPId = schedule[schedule.length - 1].pId;
                if (lastPId != -1) {
                    lastPreemptTime[lastPId] = curTime;
                }
            }
        } else {
            schedule.push({
                pId: -1,
                start: curTime,
                end: curTime + 1,
            });
        }

        curTime += 1;
    }
    var finalSchedule = MergeProcesses(schedule);
    return finalSchedule;
}

// var processes = [];
// for (var i = 0; i < 4; i += 1) {
//     var temp = Math.floor(Math.random() * 10 + 1);
//     processes.push({
//         pId: i,
//         burstTime: Math.floor(Math.random() * 10 + 1),
//         deadline: temp + Math.floor(Math.random() * 10 + 1),
//         arrivalTime: temp,
//     });
// }

// console.log(processes);

// finalSchedule = experiment(processes);
// console.log(finalSchedule);

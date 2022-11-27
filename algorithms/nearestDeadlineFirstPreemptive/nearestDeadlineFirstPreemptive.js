var ganttChart = document.getElementById('ganttChart');
var colors = [
    '#F9F871',
    '#A3CFCD',
    '#FFE3F1',
    '#BFFCF9',
    '#D3FBD8',
    '#CF9EAC',
    '#B9AA87',
    '#CBCCFF',
];
var numColors = colors.length;
var numProcess = 0;
var tmp = [];
var tmp2 = [];
var initialNumProcess = 4;
function init() {
    for (var i = 0; i < initialNumProcess; i++) addRow();
}
function MergeProcesses(schedule) {
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

function NearestDeadlineFirst(processes) {
    const MX = 1e9;
    var burstTime = [];
    var deadline = [];
    var arrivalTime = [];

    const n = processes.length;
    for (var i = 0; i < n; i += 1) {
        burstTime.push(processes[i].burstTime);
    }
    for (var i = 0; i < n; i += 1) {
        deadline.push(processes[i].deadline);
    }
    for (var i = 0; i < n; i += 1) {
        arrivalTime.push(processes[i].arrivalTime);
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
        var mn = MX;
        var process = -1;
        for (var i = 0; i < n; i += 1) {
            if (arrivalTime[i] <= curTime && deadline[i] < mn && !visited[i]) {
                mn = deadline[i];
                process = processes[i].pId;
            }
        }
        if (mn != MX) {
            schedule.push({
                pId: process,
                start: curTime,
                end: curTime + 1,
            });
            curTime += 1;
            completed[process] += 1;
            if (completed[process] == burstTime[process]) {
                done += 1;
                visited[process] = 1;
            }
        } else {
            schedule.push({
                pId: -1,
                start: curTime,
                end: curTime + 1,
            });
            curTime += 1;
        }
    }
    var finalSchedule = MergeProcesses(schedule);
    return finalSchedule;
}
function compute() {
    if (!checkValues()) return;

    // initialising
    document.getElementById('ganttChart').innerHTML = '';
    var processes = [];

    // parsing the input
    var arrivalTimeArr = Array.from(
        document.getElementsByClassName('arrivalTime')
    ).map((entry) => parseFloat(entry.value));

    var burstTimeArr = Array.from(
        document.getElementsByClassName('burstTime')
    ).map((entry) => parseFloat(entry.value));

    var deadlineArr = Array.from(
        document.getElementsByClassName('deadline')
    ).map((entry) => parseFloat(entry.value));

    var processes = arrivalTimeArr.map((entry, idx) => {
        return {
            pId: idx,
            arrivalTime: arrivalTimeArr[idx],
            burstTime: burstTimeArr[idx],
            deadline: deadlineArr[idx],
        };
    });

    //-------------------------------------Main Algorithm (input is array of 'processes')-----------------------------------------

    var slots = NearestDeadlineFirst(processes);
    //----------------------------------------output will be array of 'slots'---------------------------------------------------

    var totalTime = slots.at(-1).end;
    for (var i = 0; i < slots.length; i += 1) {
        var pId = slots[i].pId;
        var start = slots[i].start;
        var end = slots[i].end;

        var curWidth = ((end - start) / (totalTime * 1.1)) * 100;
        if (pId == -1) {
            ganttChart.innerHTML +=
                '<div class="gantt_block" style="background-color: #B9B9B9' +
                '; width: ' +
                curWidth +
                '%;">' +
                'Bubble' +
                '<br/>' +
                start +
                ' - ' +
                end +
                '</div>';
            continue;
        }
        ganttChart.innerHTML +=
            '<div class="gantt_block" style="background-color: ' +
            colors[i % numColors] +
            '; width: ' +
            curWidth +
            '%;">P' +
            pId +
            '<br/>' +
            start +
            ' - ' +
            end +
            '</div>';

        var tat = end - arrivalTimeArr[pId];
        var wt = tat - burstTimeArr[pId];
        document.getElementById('P' + pId + '_TAT').innerText = tat;
        document.getElementById('P' + pId + '_WT').innerText = wt;
    }

    var totalTat = 0;
    Array.from(document.getElementsByClassName('TAT')).forEach(function (el) {
        totalTat += parseFloat(el.innerText);
    });
    document.getElementById('AVG_TAT').innerText = (
        totalTat / numProcess
    ).toFixed(2);
    var totalWt = 0;
    Array.from(document.getElementsByClassName('WT')).forEach(function (el) {
        totalWt += parseFloat(el.innerText);
    });
    // console.log(totalTat, totalWt, numProcess);
    document.getElementById('AVG_WT').innerText = (
        totalWt / numProcess
    ).toFixed(2);
}

function checkValues() {
    var flag = true;
    $('#errorMessage').empty();
    $('.arrivalTime').each(function (index) {
        if (
            $(this).val() == '' ||
            !$.isNumeric($(this).val()) ||
            parseFloat($(this).val()) < 0
        ) {
            $('#errorMessage').append(
                'Arrival Time for Process P' + index + ' is invalid <br/>'
            );
            flag = false;
        }
    });
    $('.burstTime').each(function (index) {
        // check if burst_time is filled out
        if (
            $(this).val() == '' ||
            !$.isNumeric($(this).val()) ||
            parseFloat($(this).val()) < 0
        ) {
            $('#errorMessage').append(
                'Arrival Time for Process P' + index + ' is invalid <br/>'
            );
            flag = false;
        }
    });

    return flag;
}
function addRow() {
    var tbody = document
        .getElementById('table')
        .getElementsByTagName('tbody')[0];
    var row = tbody.insertRow(numProcess);

    var cell0 = row.insertCell(-1);
    cell0.innerHTML = 'P' + numProcess;

    var cell1 = row.insertCell(-1);
    tmp.push(Math.floor(Math.random() * 20 + 1));
    tmp2.push(Math.floor(Math.random() * 20 + 1));
    cell1.innerHTML =
        '<input type="text" class="arrivalTime" id =P' +
        numProcess +
        ' ' +
        'value=' +
        tmp.at(-1) +
        '>';
    var cell2 = row.insertCell(-1);
    cell2.innerHTML =
        '<input type="text" class="deadline" id =P' +
        numProcess +
        ' ' +
        'value=' +
        Math.floor(tmp.at(-1) + tmp2.at(-1) + Math.random() * 20 + 1) +
        '>';
    var cell3 = row.insertCell(-1);
    cell3.innerHTML =
        '<input type="text" class="burstTime" id =P' +
        numProcess +
        ' ' +
        'value=' +
        tmp2.at(-1) +
        '>';

    var cell3 = row.insertCell(-1);
    cell3.innerHTML =
        '<span id ="P' + numProcess + '_TAT" class = "TAT"></span>';

    var cell4 = row.insertCell(-1);
    cell4.innerHTML = '<span id ="P' + numProcess + '_WT" class = "WT"></span>';

    numProcess++;
}
function deleteRow() {
    document.getElementById('table').deleteRow(numProcess);
    numProcess--;
}

init();

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
var numEdges = 0;
var tmp = [];
var tmp2 = [];
var initialNumProcess = 4;
function init() {
    for (var i = 0; i < initialNumProcess; i++) addRow();
}
// graph is in adjacency list representation

function topSortDfs(cur, graph, visited, topSortOrder, burstTime) {
    visited[cur] = true;
    graph[cur].sort((a, b) => {
        return burstTime[a] - burstTime[b];
    });
    graph[cur].forEach((next) => {
        if (!visited[next])
            topSortDfs(next, graph, visited, topSortOrder, burstTime);
    });
    topSortOrder.push(cur);
}
function precedenceGraph(processes, graph) {
    var burstTime = [];
    var arrivalTime = [];
    var pId = [];
    const n = processes.length;
    for (var i = 0; i < n; i += 1) {
        burstTime.push(processes[i].burstTime);
        arrivalTime.push(processes[i].arrivalTime);
        pId.push(processes[i].pId);
    }

    var topSortOrder = [];
    var visited = new Array(n).fill(false);
    pId.sort((a, b) => {
        return burstTime[a] - burstTime[b];
    });
    for (var i = 0; i < n; i++)
        if (!visited[pId[i]])
            topSortDfs(pId[i], graph, visited, topSortOrder, burstTime);
    topSortOrder.reverse();

    var schedule = [];
    var curTime = 0;
    var p = 0;
    while (p < n) {
        var next = topSortOrder[p];
        if (arrivalTime[next] <= curTime) {
            schedule.push({
                pId: processes[next].pId,
                start: curTime,
                end: curTime + burstTime[next],
            });
            curTime += burstTime[next];
            p++;
        } else {
            schedule.push({
                pId: -1,
                start: curTime,
                end: curTime + 1,
            });
            curTime += 1;
        }
    }
    // console.log(schedule);
    curSlot = {
        pId: -1,
        start: Number.MAX_VALUE,
        end: -1,
    };
    var finalSchedule = [];
    for (var i = 0; i < schedule.length; i++) {
        if (schedule[i].pId == -1) {
            curSlot.start = Math.min(curSlot.start, schedule[i].start);
            curSlot.end = Math.max(curSlot.end, schedule[i].end);
        } else {
            if (curSlot.end != -1) {
                finalSchedule.push(curSlot);
            }
            finalSchedule.push(schedule[i]);
            curSlot = {
                pId: -1,
                start: Number.MAX_VALUE,
                end: -1,
            };
        }
    }
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

    var from = Array.from(document.getElementsByClassName('from')).map(
        (entry) => parseFloat(entry.value)
    );
    var to = Array.from(document.getElementsByClassName('to')).map((entry) =>
        parseFloat(entry.value)
    );
    graph = [];
    for (var i = 0; i < numProcess; i++) graph.push([]);
    for (var e = 0; e < numEdges; e++) {
        graph[from[e]].push(to[e]);
    }
    var processes = arrivalTimeArr.map((entry, idx) => {
        return {
            pId: idx,
            arrivalTime: arrivalTimeArr[idx],
            burstTime: burstTimeArr[idx],
        };
    });
    //-------------------------------------Main Algorithm (input is array of 'processes')-----------------------------------------

    var slots = precedenceGraph(processes, graph);
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
function addEdge() {
    var tbody = document
        .getElementById('table2')
        .getElementsByTagName('tbody')[0];
    var row = tbody.insertRow(numEdges);

    var cell0 = row.insertCell(-1);

    cell0.innerHTML = '<input type="text" class=from value=0>';

    var cell1 = row.insertCell(-1);
    cell1.innerHTML = '<input type="text" class=to value=0>';

    numEdges++;
}
function removeEdge() {
    document.getElementById('table2').deleteRow(numEdges);
    numEdges--;
}
function deleteRow() {
    document.getElementById('table').deleteRow(numProcess);
    numProcess--;
}

init();

var ganttDiv = document.getElementById('ganttDiv');
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
var initialNumProcess = 4;
function init() {
    for (var i = 0; i < initialNumProcess; i++) addRow();
}
function makespanPre(processes) {
    const n = processes.length;
    var burstTime = [];
    var totalSum = [];
    for (var i = 0; i < n; i += 1) {
        burstTime.push(processes[i].burstTime);
    }
    for (var i = 0; i < m; i++) {
        totalSum.push(0);
    }
    for (var i = 0; i < n; i++) {
        sum += burstTime[i];
    }
    const d = parseInt(sum / m);
    d += 1;

    var ptr = 0;

    for (var i = 0; i < n; i += 1) {
        if (totalSum[ptr] + burstTime[i] < d) {
            allocation[ptr].push({
                pId: processes.pId,
                start: totalSum[ptr],
                end: totalSum[ptr] + burstTime[i],
            });
            totalSum[ptr] += burstTime[i];
        } else {
            allocation[ptr].push({
                pId: processes.pId,
                start: totalSum[ptr],
                end: d,
            });
            totalSum[ptr] = d;
            i--;
            ptr++;
        }
    }
    return allocation;
}
function compute() {
    if (!checkValues()) return;

    // initialising
    ganttDiv.innerHTML = '';
    var processes = [];

    // parsing the input

    var burstTimeArr = Array.from(
        document.getElementsByClassName('burstTime')
    ).map((entry) => parseFloat(entry.value));

    var processes = burstTimeArr.map((entry, idx) => {
        return {
            pId: idx,
            burstTime: burstTimeArr[idx],
        };
    });
    var numCores = parseFloat(
        document.getElementById('numCores').value == ''
            ? 1
            : document.getElementById('numCores').value
    );
    // console.log(processes, numCores);
    //-------------------------------------Main Algorithm (input is array of 'processes')-----------------------------------------

    var slots = makespanNonPreOffline(processes, numCores);

    //----------------------------------------output will be array of 'slots'---------------------------------------------------
    // console.log(slots);
    // assert(0);
    var totalTime = slots.at(-1).end;
    for (var j = 0; j < numCores; j++) {
        ganttDiv.innerHTML += '<div id="ganttChart' + j + '"></div>';
        var ganttChart = document.getElementById('ganttChart' + j);
        ganttChart.innerHTML +=
            '<div class="gantt_block" style="background-color:black; color:white;" width: ' +
            '5%;">C' +
            j +
            ':</div>';
        for (var i = 0; i < slots[j].length; i += 1) {
            var pId = slots[j][i].pId;
            var start = slots[j][i].start;
            var end = slots[j][i].end;
            var curWidth = ((end - start) / (totalTime * 1.1)) * 100;
            if (pId == -1) {
                ganttChart +=
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

            var tat = end;
            var wt = tat - burstTimeArr[pId];
            document.getElementById('P' + pId + '_TAT').innerText = tat;
            document.getElementById('P' + pId + '_WT').innerText = wt;
        }
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

    var cell2 = row.insertCell(-1);
    cell2.innerHTML =
        '<input type="text" class="burstTime" id =P' +
        numProcess +
        ' ' +
        'value=' +
        Math.floor(Math.random() * 20 + 1) +
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

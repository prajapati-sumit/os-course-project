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
var initialNumProcess = 4;
function init() {
    for (var i = 0; i < initialNumProcess; i++) addRow();
}
function FirstComeFirstServe(processes) {
    var slots = [];

    processes.sort(function (a, b) {
        return a.arrivalTime - b.arrivalTime;
    });
    var globalStartTime = 0;
    var globalEndTime = 0;
    console.assert(processes.length == numProcess);
    for (var p = 0; p < numProcess; p++) {
        var pId = processes[p].pId;
        var arrivalTime = processes[p].arrivalTime;
        var burstTime = processes[p].burstTime;
        if (globalStartTime < arrivalTime) {
            slots.push({
                pId: -1,
                start: globalStartTime,
                end: arrivalTime,
            });
            globalStartTime = arrivalTime;
        }

        globalEndTime = globalStartTime + burstTime;
        slots.push({
            pId: pId,
            start: globalStartTime,
            end: globalEndTime,
        });

        globalStartTime = globalEndTime;
    }
    return slots;
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

    var processes = arrivalTimeArr.map((entry, idx) => {
        return {
            pId: idx,
            arrivalTime: arrivalTimeArr[idx],
            burstTime: burstTimeArr[idx],
        };
    });

    //-------------------------------------Main Algorithm (input is array of 'processes')-----------------------------------------

    var slots = FirstComeFirstServe(processes);

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

        var wt = start;
        var tat = end;
        document.getElementById('P' + pId + '_TAT').innerText = tat;
        document.getElementById('P' + pId + '_WT').innerText = wt;
    }

    var totalTat = 0;
    Array.from(document.getElementsByClassName('TAT')).forEach(function (el) {
        totalTat += parseFloat(el.innerText);
    });
    document.getElementById('AVG_TAT').innerText = totalTat / numProcess;
    var totalWt = 0;
    Array.from(document.getElementsByClassName('WT')).forEach(function (el) {
        totalWt += parseFloat(el.innerText);
    });
    // console.log(totalTat, totalWt, numProcess);
    document.getElementById('AVG_WT').innerText = totalWt / numProcess;
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
    cell1.innerHTML =
        '<input type="text" class="arrivalTime" id =P' +
        numProcess +
        ' ' +
        'value=' +
        Math.floor(Math.random() * 20 + 1) +
        '>';

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

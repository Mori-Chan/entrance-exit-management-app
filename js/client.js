const readForm = document.getElementById('readForm');
const entranceForm = document.getElementById('entranceForm');
const exitForm = document.getElementById('exitForm');

readForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch('/read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.text())
    .then((data) => {
        console.log(data);
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = data;
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
});

entranceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const entranceInput = document.getElementById('entranceInput');
    const entranceValue = entranceInput.value;
    const entranceAreaValue = document.getElementById('entranceAreaInput').value;

    fetch('/entrance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entrance: entranceValue, entranceArea: entranceAreaValue }),
    })
    .then((response) => response.text())
    .then((data) => {
        console.log(data);
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = data;
        entranceInput.value = '';
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
});

exitForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const exitInput = document.getElementById('exitInput');
    const exitValue = exitInput.value;

    fetch('/exit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exit: exitValue }),
    })
    .then((response) => response.text())
    .then((data) => {
        console.log(data);
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = data;
        exitInput.value = '';
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
});
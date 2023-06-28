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
    .then((response) => response.json())
    .then((data) => {
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = `<p>ビギナーエリア：${ data.beginner }</p><p>コンペエリア：${ data.compe }</p><p>リードエリア：${ data.lead }</p><p>スピードエリア：${ data.speed }</p><p>手帳：${ data.disabled }</p><p>介助者：${ data.caregiver }</p>`;
        tableContainer.innerHTML += data.html;
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
    const disabled = document.getElementById('disabled');
    const caregiver = document.getElementById('caregiver');
    const card = document.getElementById('card');

    fetch('/entrance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            entrance: entranceValue, 
            entranceArea: entranceAreaValue,
            disabled: disabled.checked,
            caregiver: caregiver.checked,
            card: card.checked,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = `<p>ビギナーエリア：${ data.beginner }</p><p>コンペエリア：${ data.compe }</p><p>リードエリア：${ data.lead }</p><p>スピードエリア：${ data.speed }</p><p>手帳：${ data.disabled }</p><p>介助者：${ data.caregiver }</p>`;
        tableContainer.innerHTML += data.html;

        entranceInput.value = '';
        disabled.checked = false;
        caregiver.checked = false;
        card.checked = false;
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
    .then((response) => response.json())
    .then((data) => {
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = `<p>ビギナーエリア：${ data.beginner }</p><p>コンペエリア：${ data.compe }</p><p>リードエリア：${ data.lead }</p><p>スピードエリア：${ data.speed }</p><p>手帳：${ data.disabled }</p><p>介助者：${ data.caregiver }</p>`;
        tableContainer.innerHTML += data.html;

        exitInput.value = '';
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
});
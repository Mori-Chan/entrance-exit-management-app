const express = require('express');
const app = express();
const path = require('path');
const readExcel = require('./commands/readExcel');
const inputEntranceExcel = require('./commands/inputEntranceExcel');
const inputExitExcel = require('./commands/inputExitExcel');

const excelPath = path.join(__dirname, '..', '入退場者記録.xlsx');
const listPath = path.join(__dirname, '..', '会員登録者リスト.xlsx');

const today = new Date();
const options = { timeZone: 'Asia/Tokyo' };
const day = today.toLocaleString('en-US', { day: '2-digit', ...options });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));


app.post('/read', async (req, res) => {
    try {
        const data = await readExcel(excelPath, listPath, day);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.post('/entrance', async (req, res) => {
    const entrance = req.body.entrance;
    const entranceArea = req.body.entranceArea;
    const disabled = req.body.disabled;
    const caregiver = req.body.caregiver;
    const card = req.body.card;
    try {
        await inputEntranceExcel( excelPath, day, entrance, entranceArea, disabled, caregiver, card );
        const data = await readExcel( excelPath, listPath, day );
        res.send( data );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).send( 'An error occurred' );
    }
});

app.post('/exit', async (req, res) => {
    const exit = req.body.exit;
    try {
        const err = await inputExitExcel(excelPath, day, exit);
        if ( err ) {
            res.send(err);
        } else {
            const data = await readExcel(excelPath, listPath, day);
            res.send(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`サーバーがポート ${port} で起動しました。`);
});
const os = require('os');
const fs = require('fs');
const express = require('express');
const Busboy = require('busboy');
const _ = require('lodash');

const platformNIC = () => {
    const interfaces = os.networkInterfaces();
    switch (process.platform) {
        case 'darwin':
            return interfaces.lo0;
        case 'linux':
            if (interfaces.ens192) return interfaces.ens192;
            if (interfaces.eno16780032) return interfaces.eno16780032;
            return interfaces.lo;
        default:
            return interfaces.Ethernet0 ? interfaces.Ethernet0 : interfaces['Wi-Fi'];
    }
};
const getIpAdress = () => {
    const nic = platformNIC();
    const ipv4 = _.find(nic, (item) => item.family === 'IPv4');
    return ipv4.address;
};

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080'];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-Request-Id', 'localhost-1234567890');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Expose-Headers', 'X-Request-Id');
    next();
});

const søkerMock1 = {
    aktørId: '1234567890',
    fornavn: 'Test',
    mellomnavn: null,
    etternavn: 'Testesen',
    myndig: true,
    fødselsnummer: '12345123456',
    fødselsdato: '2020-01-01',
};

const barnMock = {
    barn: [
        { fødselsdato: '1990-01-01', fornavn: 'Barn', mellomnavn: 'Barne', etternavn: 'Barnesen', aktørId: '1' },
        { fodselsdato: '1990-01-02', fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '2' },
    ],
};

const arbeidsgivereMock = {
    organisasjoner: [
        { navn: 'Arbeids- og velferdsetaten', organisasjonsnummer: '123451234' },
        { navn: 'Arbeids- og sosialdepartementet', organisasjonsnummer: '123451235' },
    ],
};

const MELLOMLAGRING_JSON = `${os.tmpdir()}/mellomlagring.json`;

const isJSON = (str) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};
const writeFileAsync = async (path, text) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
const readFileSync = (path) => {
    return fs.readFileSync(path, 'utf8');
};
const existsSync = (path) => fs.existsSync(path);

const startServer = () => {
    const port = 8083;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/arbeidsgiver', (req, res) => {
        // Kan brukes for å se spinneren på arbeidstaker steget.
        // setTimeout(() => {
        //     res.send(arbeidsgivereMock);
        // }, 5000)
        res.send(arbeidsgivereMock);
    });

    server.get('/soker', (req, res) => {
        res.send(søkerMock1);
    });

    server.post('/vedlegg', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Location');
        res.set('Location', 'nav.no');
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('finish', () => {
            res.writeHead(200, { Location: '/vedlegg' });
            res.end();
        });
        req.pipe(busboy);
    });

    server.get('/barn', (req, res) => res.send(barnMock));

    server.post('/soknad', (req, res) => {
        res.sendStatus(200);
    });

    server.get('/mellomlagring', (req, res) => {
        if (existsSync(MELLOMLAGRING_JSON)) {
            const body = readFileSync(MELLOMLAGRING_JSON);
            res.send(JSON.parse(body));
        } else {
            res.send({});
        }
    });
    server.post('/mellomlagring', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });
    server.put('/mellomlagring', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });
    server.delete('/mellomlagring', (req, res) => {
        // setTimeout(() => {
        //     writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        //     res.sendStatus(202);
        // }, 2000);
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        res.sendStatus(202);
    });

    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
        console.log('nic ipv4=', getIpAdress());
    });
};

startServer();

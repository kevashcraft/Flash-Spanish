const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const crypto = require('crypto')
const axios = require('axios')

axios.defaults.headers.common['User-Agent'] = 'Spanish Flashcards - contact spanish@kevapps.com with any issues';


// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const ttsClient = new textToSpeech.TextToSpeechClient();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../secret/token.json';

// Load client secrets from a local file.
fs.readFile('../secret/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    // authorize(JSON.parse(content), listMajors);
    authorize(JSON.parse(content), dothings);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
  
const dataStructureJSON = JSON.stringify({
    version: 1,
    index: -1,
    hash: null,
    questionType: 'text',
    questionText: null,
    images: {},
    imageSelected: '',
    hintType: 'none',
    answerType: 'text',
    answerText: null
})

let pixelBayKeyFileContent = fs.readFileSync('../secret/pixelbay.json')
const pixabay = JSON.parse(pixelBayKeyFileContent)
const pixalBayApiKey = pixabay.apiKey

let giphyKeyFileContent = fs.readFileSync('../secret/giphy.json')
const giphyKeyFileData = JSON.parse(giphyKeyFileContent)
const giphyApiKey = giphyKeyFileData.apiKey

async function dothings(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    let spreadsheetId = '1xl8zNXQJSnEFpEIeX7fYMht_BMwISDQiIAJYkEICXO0'
    let decks = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Decks!A:A'})
    var decksOut = []
    // console.log("decks.data.values", decks.data.values)
    // for (let deckIdx in decks.data.values) {
    for (let deckIdx in {3: null}) {
        let deckName = decks.data.values[deckIdx][0]
        console.log("deckName", deckName)
        // continue
        let deckNameNS = deckName.replace(/ /g, '')

        let prevDeckData = {}
        try {
            let prevDeckDataJSON = fs.readFileSync(`src/decks/${deckNameNS}.json`)
            prevDeckData = JSON.parse(prevDeckDataJSON)
        } catch (e) {
            console.log("No prev deck data")
        }

        let deckData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${deckName}!A:B` })
        let cards = []
        let prevCards = {}
        // console.log("prevDeckData", prevDeckData)
        // for (let index in deckData.data.values.slice(0, 5)) {
        for (let index in deckData.data.values) {
            await new Promise(r => setTimeout(r, 2500))
            let row = deckData.data.values[index]
            let data = {}
            let dataStructure = JSON.parse(dataStructureJSON)
            for (let key in dataStructure) {
                if (row[1] in prevDeckData && prevDeckData[row[1]].version >= dataStructure.version) {
                    // console.log("FOOUND!")
                    data[key] = prevDeckData[row[1]][key]
                } else {
                    data[key] = dataStructure[key]
                }
            }
            // continue
            data.index = index
            data.questionText = row[1]
            data.answerText = row[0]
            data.hash = crypto.createHash('md5').update(data.questionText).digest('hex')

            console.log(deckName, data.questionText);

            // let resp = await axios.get(`http://api.giphy.com/v1/gifs/search?q=${data.answerText.replace(/ /g, '+')}&api_key=${giphyApiKey}&limit=5`);
            // xhr.done(function(data) { console.log("success got data", data); });
            // console.log("resp.data", resp.data)
            // continue

            let resp = await axios.get(`https://pixabay.com/api/?key=${pixalBayApiKey}&per_page=10&safesearch=true&q=${data.answerText.replace(/ /g, '+')}&image_type=photo&pretty=true`)
            let imgList = resp.data
            // console.log("imgList", imgList)
            let imgData = data.images
            // console.log("imgData", imgData)
            // for (let imgIdx in imgList.data) {
            for (let imgIdx in imgList.hits) {
                // let resInfo = imgList.data[imgIdx]
                let resInfo = imgList.hits[imgIdx]
                // let ext = 'gif'
                let ext = resInfo.previewURL.split('.').pop().toLowerCase()
                if (ext === 'jpg') {
                    ext = 'jpeg'
                }
                let imgHash = crypto.createHash('md5').update(resInfo.id.toString()).digest('hex')
                // let imgHash = crypto.createHash('md5').update(resInfo.id).digest('hex')
                console.log("imgHash", imgHash)

                if (!(imgHash in data.images)) {
                    console.log("getting images")
                    // console.log("resInfo", resInfo)
                    // continue
                    // let gifImgReq = await axios.get(`https://media.giphy.com/media/${resInfo.id}/giphy.gif`, {responseType: 'arraybuffer'})
                    // let previewImgReq = await axios.get(resInfo.previewURL, {responseType: 'arraybuffer'})
                    // let largeImgReq = await axios.get(resInfo.largeImageURL, {responseType: 'arraybuffer'})
                    let webImgReq = await axios.get(resInfo.webformatURL, {responseType: 'arraybuffer'})
    
                    // let gifImg = `data:image/${ext};base64,` + Buffer.from(gifImgReq.data, 'binary').toString('base64')
                    // let previewImg = `data:image/${ext};base64,` + Buffer.from(previewImgReq.data, 'binary').toString('base64')
                    // let largeImg = `data:image/${ext};base64,` + Buffer.from(largeImgReq.data, 'binary').toString('base64')
                    let webImg = `data:image/${ext};base64,` + Buffer.from(webImgReq.data, 'binary').toString('base64')
                    
                    // console.log("preview", preview)
                    imgData[imgHash] = {
                        // gifImg,
                        // previewImg,
                        // largeImg,
                        webImg
                    }
                }
            }
            data.images = imgData

            // // get audio
            // let request = {
            //   input: { text: data.questionText },
            //   voice: {
            //     languageCode: 'es-ES',
            //     ssmlGender: 'FEMALE',
            //     name: 'es-ES-Standard-A'
            //   },
            //   audioConfig: {
            //     audioEncoding: 'MP3',
            //     pitch: 0,
            //     effectsProfileId: ['headphone-class-device'],
            //     speakingRate: '.9'
            //   },
            // };

            // let [response] = await ttsClient.synthesizeSpeech(request)

            // data.audio = 'data:audio/mp3;base64,' + response.audioContent.toString('base64')

            // cards.push(data)
            prevCards[data.questionText] = data
        }

        // save prevcards 
        fs.writeFileSync(`src/decks/${deckNameNS}.json`, JSON.stringify(prevCards))

        // // save
        // fs.writeFileSync(`public/${deckNameNS}.json`, JSON.stringify({
        //     deck: {
        //         label: deckName
        //     },
        //     cards
        // }))
    }
}

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const crypto = require('crypto')

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
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

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

const dataStructure = {
    version: 1,
    index: -1,
    hash: null,
    questionType: 'text',
    questionText: null,
    hintType: 'none',
    answerType: 'text',
    answerText: null
}

async function dothings(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    let spreadsheetId = '1xl8zNXQJSnEFpEIeX7fYMht_BMwISDQiIAJYkEICXO0'
    let decks = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Decks!A:A'})
    var decksOut = []
    for (let deckIdx in decks.data.values) {
        let deckName = decks.data.values[deckIdx][0]
        let deckData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${deckName}!A:B` })
        let cards = []
        for (let index in deckData.data.values) {
            let row = deckData.data.values[index]
            let data = {}
            for (let key in dataStructure) {
                data[key] = dataStructure[key]
            }

            data.index = index
            data.questionText = row[1]
            data.answerText = row[0]
            data.hash = crypto.createHash('md5').update(data.questionText).digest('hex')

            console.log(deckName, data.questionText);
            // get audio
            let request = {
              input: { text: data.questionText },
              voice: {
                languageCode: 'es-ES',
                ssmlGender: 'FEMALE',
                name: 'es-ES-Standard-A'
              },
              audioConfig: {
                audioEncoding: 'MP3',
                pitch: 0,
                effectsProfileId: ['headphone-class-device'],
                speakingRate: '.9'
              },
            };

            let [response] = await ttsClient.synthesizeSpeech(request)

            data.audio = 'data:audio/mp3;base64,' + response.audioContent.toString('base64')

            cards.push(data)
        }

        decksOut.push({
          version: 1,
          label: deckName,
          deck: cards
        })
    }
    fs.writeFileSync(`src/decks.json`, JSON.stringify(decksOut))
}

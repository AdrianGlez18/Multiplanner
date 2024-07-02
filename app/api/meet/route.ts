/***
 * 
 * Objetivos mañanma primera hora: Creacion de grupos y envio a BBDD. Pantalla grupos.
 * Imagen en la home
 * 
 * Opcion A: Crear automaticamente un meeting space cada vez que se registre un usuario donde se asignarán sus reuniones.
 * De esta forma, no será necesario reautenticar y los problemas con webpack. Se obtendria este espacio de la BBDD cada vez
 * 
 * Opcion B: Crear un backend con una API simple en express encargada unicamente de crear las reuniones y retornar los enlaces.
 * Con esta forma, habría una doble autenticación
 */
/* 
export async function GET(req: any, res: any) {
    try {
        const meetClient = new SpacesServiceClient();
        let status: Number = 200

        const request = {
            "name": "test",
            "config": {
                "accessType": "OPEN",
                "entryPointAccess": "ALL"
            },
        };

        const response = await meetClient.createSpace(request);
        console.log(response);

        //return JSON.parse(JSON.stringify(response));
        res.status(status).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({error})
    }
} */


export async function GET(req: any, res: any) {
    //const { SpacesServiceClient } = require('@google-apps/meet').v2;
    const fs = require('fs').promises;
    const path = require('path');
    const process = require('process');
    const { authenticate } = require('@google-cloud/local-auth');
    const { SpacesServiceClient } = require('@google-apps/meet').v2;
    const { auth } = require('google-auth-library');

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created'];

    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = path.join(process.cwd(), 'token.json');
    const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);
            return auth.fromJSON(credentials);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async function saveCredentials(client: any) {
        const content = await fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */
    async function authorize() {
        let client = await loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
        return client;
    }

    /**
     * Creates a new meeting space.
     * @param {OAuth2Client} authClient An authorized OAuth2 client.
     */
    async function createSpace(authClient: any) {
        const meetClient = new SpacesServiceClient({
            authClient: authClient
        });
        // Construct request
        const request = {
            "name": "test",
            "config": {
                "accessType": "OPEN",
                "entryPointAccess": "ALL"
            },
        };

        // Run request
        const response = await meetClient.createSpace(request);
        console.log(`Meet URL: ${response[0].meetingUri}`);
    }

    //authorize().then(createSpace).catch(console.error);
    try {
        const authResponse = authorize();
        const createResponse = await createSpace(authResponse);
        res.status(200)
    } catch (error) {
        console.error(error)
        res.status(500);
    }
}
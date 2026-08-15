const {MongoClient, ObjectId} = require('mongodb')

// Database parameters
const DATABASE_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const DATABASE_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DATABASE_DB = process.env.MONGO_INITDB_DATABASE;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;

// Connect with database
const URI = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`;
const client = new MongoClient(URI);
const db = client.db(DATABASE_DB);

// Connect with collection
const DATABASE_USERNAME_COLLECTION = process.env.DATABASE_USERNAME_COLLECTION;
const DATABASE_DEVICENAME_COLLECTION = process.env.DATABASE_DEVICENAME_COLLECTION;
const collection_usernames = db.collection(DATABASE_USERNAME_COLLECTION);
const collection_devicenames = db.collection(DATABASE_DEVICENAME_COLLECTION);

// Devicename controller
const devicenameController = require("./devicenames");

// Controller end points
exports.getUsernames = async (req, res) => {
    try {
            if(req.query.devicename != undefined)
            {
                await client.connect();
                res.send(JSON.stringify(await collection_usernames.find({deviceName: String(req.query.devicename)}).toArray()))
                return;
            }
            await client.connect();
            const result = await collection_usernames.find({}).toArray();
            res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
}
exports.postUsername = async (req, res) => {
    try{
        await client.connect();
        if(!await collection_devicenames.findOne({devicename: String(req.body.deviceName)}))
    {
        await collection_devicenames.insertOne({deviceName: String(req.body.deviceName)});
    }
    if(await collection_usernames.findOne({deviceName: String(req.body.deviceName), userName: String(req.body.userName)}))
        {
            res.status(400).send('Bad request: username already exists for device ' + String(req.body.deviceName));
            return;
        }
        await collection_usernames.insertOne({deviceName: String(req.body.deviceName), userName: String(req.body.userName)})
        .then((result) => {
            console.log("Added user " + String(result.insertedId) + " to device " + String(req.body.deviceName));
            res.send("Added user name: " + String(result.insertedId) + " tot device: " + String(req.body.deviceName));
        })
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
    
}
exports.deleteUsername = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                await collection_usernames.deleteOne(query);
                res.status(200).json({
                    message: "Username deleted"
                });
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
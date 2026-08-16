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
const DATABASE_DEVICENAME_COLLECTION = process.env.DATABASE_DEVICENAME_COLLECTION;
const collection_devicenames = db.collection(DATABASE_DEVICENAME_COLLECTION);

// Controller end points
exports.getDeviceNames = async (req, res) => {
    try {
            await client.connect();
            const result = await collection_devicenames.find({}).toArray();
            res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
}
exports.postDeviceName = async (req, res) => {
    try {
     if(await collection_devicenames.findOne({deviceName: String(req.body.deviceName)}))
        {
            res.status(400).send('Bad request: device already exists');
            return;
        }
        await collection_devicenames.insertOne({deviceName: String(req.body.deviceName)})
        .then((result) => {
            console.log("Added device " + String(result.insertedId));
            res.send("Added device name: " + String(result.insertedId));
        })
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
    
}
exports.deleteDeviceName = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                await collection_devicenames.deleteOne(query);
                res.status(200).json({
                    message: "Device name deleted"
                });
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
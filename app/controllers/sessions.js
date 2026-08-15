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
const DATABASE_SESSIONS_COLLECTION = process.env.DATABASE_SESSIONS_COLLECTION;
const DATABASE_USERNAME_COLLECTION = process.env.DATABASE_USERNAME_COLLECTION;
const DATABASE_DEVICENAME_COLLECTION = process.env.DATABASE_DEVICENAME_COLLECTION;
const collection_sessions = db.collection(DATABASE_SESSIONS_COLLECTION);
const collection_usernames = db.collection(DATABASE_USERNAME_COLLECTION);
const collection_devicenames = db.collection(DATABASE_DEVICENAME_COLLECTION);

// Controller end points
exports.getSessions = async (req, res) => {
    try {
            if(req.query.devicename != undefined)
            {
                await client.connect();
                const query = {"deviceName": String(req.query.devicename)};
                const result = await collection_sessions.find(query).toArray();
                res.send(JSON.stringify(result));
                return;
            }
            if(req.query.username != undefined)
            {
                await client.connect();
                const query = {"userName": String(req.query.username)};
                const result = await collection_sessions.find(query).toArray();
                res.send(JSON.stringify(result));
                return;
            }
            await client.connect();
            const result = await collection_sessions.find({}).toArray();
            res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
}
exports.postSession = async (req, res) => {
    try {
            await client.connect();
            if(!await collection_devicenames.findOne({"deviceName": String(req.body.deviceName)}))
            {
                collection_devicenames.insertOne({"deviceName": String(req.body.deviceName)})
                .then((result) => {
                    console.log("Added device " + String(result.insertedId));
                })
            }
            if(!await collection_usernames.findOne({"deviceName": String(req.body.deviceName), "userName": String(req.body.userName)}))
            {
                collection_usernames.insertOne({"deviceName": String(req.body.deviceName), "userName": String(req.body.userName)})
                .then((result) => {
                    console.log("Added user " + String(result.insertedId) + " to device " + String(req.body.deviceName));
                })
            }
            const testQuery = {deviceName: String(req.body.deviceName), userName: String(req.body.userName), startTime: Date(req.body.startTime)}
            const test = await collection_sessions.findOne(testQuery);
            if(test) {
                res.status(400).send('Bad request: session already exists');
                return;
            }
            var newSession = {
                deviceName: req.body.deviceName,
                userName: req.body.userName,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                ended: req.body.ended
            }
            await collection_sessions.insertOne(newSession)
            .then((result) => {
                console.log(String(result.insertedId));
                res.send(String(result.insertedId));
            })
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
}
exports.getSession = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                var query = {"_id": id};
                const result = await collection_sessions.findOne(query);
                res.send(JSON.stringify(result));
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
exports.updateSession = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                var updates = { $set: req.body };
                let updateResult = await collection_sessions.updateOne(query, updates);
                console.log(updateResult._id);
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
exports.deleteSession = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                await collection_sessions.deleteOne(query);
                res.status(200).json({
                    message: "Session deleted"
                });
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
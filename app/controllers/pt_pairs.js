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
const DATABASE_PASSINGTHROUGH_COLLECTION = process.env.DATABASE_PASSINGTHROUGH_COLLECTION;
const DATABASE_USERNAME_COLLECTION = process.env.DATABASE_USERNAME_COLLECTION;
const DATABASE_DEVICENAME_COLLECTION = process.env.DATABASE_DEVICENAME_COLLECTION;
const collection_pt = db.collection(DATABASE_PASSINGTHROUGH_COLLECTION);
const collection_usernames = db.collection(DATABASE_USERNAME_COLLECTION);
const collection_devicenames = db.collection(DATABASE_DEVICENAME_COLLECTION);

// Controller end points
exports.getPassingThroughPairs = async (req, res) => {
    try {
            if(req.query.devicename != undefined)
            {
                await client.connect();
                const query = {"deviceName": String(req.query.devicename)};
                const result = await collection_pt.find(query).toArray();
                res.send(JSON.stringify(result));
                return;
            }
            if(req.query.username != undefined)
            {
                await client.connect();
                const query = {"userName": String(req.query.username)};
                const result = await collection_pt.find(query).toArray();
                res.send(JSON.stringify(result));
                return;
            }
            await client.connect();
            res.send(JSON.stringify(await collection_pt.find({}).toArray()))
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
}
exports.postPassingThroughPair = async (req, res) => {
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
            const test = await collection_pt.findOne(testQuery);
            if(test) {
                res.status(400).send('Bad request: pair already exists');
                return;
            }
            var newStandingStillPair = {
                deviceName: req.body.deviceName,
                userName: req.body.userName,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                ended: req.body.ended
            }
            await collection_pt.insertOne(newStandingStillPair)
            .then(result => {
                console.log(String(result.insertedId));
                res.send(String(result.insertedId));
            });
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
}
exports.getPassingThroughPair = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                const result = await collection_pt.findOne(query);
                res.send(JSON.stringify(result));
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
exports.updatePassingThroughPair = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                var updates = { $set: req.body }
                let updateResult = await collection_pt.updateOne(query, updates);
                console.log(updateResult._id);
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
exports.deletePassingThroughPair = async (req, res) => {
    try {
                await client.connect();
                var id = new ObjectId(String(req.params.id));
                const query = {"_id": id};
                await collection_pt.deleteOne(query);
                res.status(200).json({
                    message: "PTPair deleted"
                });
            } catch (err) {
                console.error(err);
            } finally {
                client.close();
            }
}
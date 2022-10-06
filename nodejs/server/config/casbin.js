
    const path = require('path');
    const { newSyncedEnforcer } = require('casbin');
    const { MongooseAdapter } = require('casbin-mongoose-adapter');
    
    const connectCasbin = async() => {
        const model = path.resolve(__dirname, './rbac_model.conf');
        const adapter = await MongooseAdapter.newAdapter(process.env.MONGO_DB_URL);
        const enforcer = await newSyncedEnforcer(model, adapter);
        enforcer.enableAutoSave(true);
        return enforcer;
    }

    module.exports = connectCasbin ;


const path = require('path');
const { newSyncedEnforcer,SyncedEnforcer } = require('casbin');
const { MongooseAdapter } = require('casbin-mongoose-adapter');
const { listIndexes } = require('../models/Project');
const Policy = require(`../models/Policy`);
const { appendFile } = require('fs');

module.exports = {

    connectToServer: async function( callback ) {
        const model = path.resolve(__dirname, './rbac_model.conf');
        const adapter = await MongooseAdapter.newAdapter(process.env.MONGO_DB_URL);
        _enforcer = await newSyncedEnforcer(model, adapter);
        await _enforcer.enableAutoSave(true);
        await _enforcer.loadPolicy();
        console.log(`Casbin Connected: ${_enforcer}`.cyan.underline.bold);
       
    },
      
    save: async function(policy) {    
        await _enforcer.addPolicy(policy.subject,policy.resource,policy.action,policy.effect);
    },
    listPolicy: async function() {
        const allNamedObjects = await _enforcer.getPolicy();
        const p = [];
        allNamedObjects.forEach(obj => {
            const policy = new Policy({
                subject: obj[0],
                resource: obj[1],
                action: obj[2],
                effect:obj[3]
            });
            console.log(obj);
            p.push(policy);
        })
        
        return p;
    }
};
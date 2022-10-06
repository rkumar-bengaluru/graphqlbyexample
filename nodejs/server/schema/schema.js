const {projects,clients} = require('../sampledata.js');
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull,
    GraphQLEnumType,
    GraphQLBoolean
    } = require('graphql');

    var casUtil = require( '../config/cas' );

// moongoose model
const Project = require('../models/Project');
const Client = require('../models/Client');
const Policy = require('../models/Policy');
const Group = require('../models/Group');
const AResponse = require('../models/AResponse');



const { default: mongoose } = require('mongoose');


//  client type

const ClientType = new GraphQLObjectType({
    name : "Client",
    fields : () => ({
        id : {type: GraphQLID},
        name : {type : GraphQLString},
        email : {type : GraphQLString},
        phone : {type : GraphQLString},
    })
});

// project type
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: {type: GraphQLID},
        name : {type : GraphQLString},
        description : {type : GraphQLString},
        status : {type : GraphQLString},
        client: {
            type: ClientType,
            resolve(parent,args) {
                return Client.findById(parent.clientId)
            }
        }
    })
});

// policy type
const PolicyType = new GraphQLObjectType({
    name : "Policy",
    fields : () => ({
        id : {type: GraphQLID},
        subject : {type : GraphQLString},
        resource : {type : GraphQLString},
        action : {type : GraphQLString},
        effect : {type : GraphQLString},
    })
});
// group type
const GroupType = new GraphQLObjectType({
    name : "Group",
    fields : () => ({
        id : {type: GraphQLID},
        name : {type : GraphQLString},
        subject : {type : GraphQLString},
    })
});

// group type
const AccessResponse = new GraphQLObjectType({
    name : "AccessResponse",
    fields : () => ({
       status : {type : GraphQLBoolean},
    })
});

const RootQuery = new GraphQLObjectType({
    name : "RootQueryType",
    fields : {
        client : {
            type: ClientType,
            args: {
                input : {type: GraphQLID}
            },
            resolve(parent, args) {
                return Client.findById(args.input)
            }
        },
        clients : {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }

        },
        policies : {
            type: new GraphQLList(PolicyType),
            resolve(parent, args) {
                return casUtil.listPolicy();
            }

        },
        checkAccess: {
            type: AccessResponse,
            args: {
                subject : {type: GraphQLString},
                resource : {type: GraphQLString},
                action : {type: GraphQLString},
            },
            resolve(parent, args) {
                console.log(args.subject,args.resource,args.action)
                res = casUtil.enforce(args.subject,args.resource,args.action);
                ares =  new AResponse({
                    status: res
                });
                console.log(ares)
                return ares;
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent,args) {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args : {
                id: {type: GraphQLID}
            },
            resolve(parent,args) {
                return Project.findById(args.id)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPolicy : {
            type: PolicyType,
            args: {
                subject : {type : new GraphQLNonNull(GraphQLString)},
                resource : {type : new GraphQLNonNull(GraphQLString)},
                action : {type : new GraphQLNonNull(GraphQLString)},
                effect : {type : new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args) {
                const policy = new Policy({
                    subject: args.subject,
                    resource: args.resource,
                    action: args.action,
                    effect: args.effect
                });
                try {
                    //enforcer.addPolicy(policy.subject,policy.subject,policy.action,policy.effect)
                    casUtil.save(policy)
                    //e.addRoleForUser(policy.subject,policy.subject,policy.action,policy.effect);
                    
                }catch(e) {
                    console.log(e);
                }
                return policy;
            }
        },
        addGroup : {
            type: GroupType,
            args: {
                name : {type : new GraphQLNonNull(GraphQLString)},
                subject : {type : new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args) {
                const grp = new Group({
                    name: args.name,
                    subject: args.subject,
                });
                return casUtil.addRoleToUser(args.name,args.subject)
            }
        },
        addClient : {
            type: ClientType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString) },
                email: {type: new GraphQLNonNull(GraphQLString) },
                phone: {type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent,args) {
                console.log(`recv a new client ${args.name} ${args.phone} ${args.email}`);
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                client.save();
                return client;
            }
        },
        deleteClient : {
            type: ClientType,
            args: {
                id : {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args) {
                console.log(`delete client ${args.id}`);
                return  Client.findByIdAndRemove(args.id)
            }
        },
        addProject : {
            type: ProjectType,
            args : {
                name: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values: {
                        'NotStarted' : {value: 'Not Started'},
                        'InProgress' : {value: 'In Progress'},
                        'Complete'   : {value: 'Complete'},
                        }
                    }),
                    defaultValue: "Not Started"
                },
                clientId : {type : new GraphQLNonNull(GraphQLID)}
            
            },
            resolve(parent,args) {
                const project = new Project({
                    name: args.name ,
                    description : args.description,
                    status : args.status,
                    clientId: args.clientId
                }
                );
                return project.save();
            }
        },
        deleteProject: {
            type : ProjectType,
            args: {
                id : {type: GraphQLID}
            },
            resolve(parent,args) {
                 Project.findByIdAndDelete(args.id);
                 return Client.findById(args.id)
            }
        },
        // update a project
        updateProject: {
            type : ProjectType,
            args : {
                id : {type : GraphQLID},
                name: {type: GraphQLString},
                description : {type: GraphQLString}
            },
            resolve(parent,args) {
                Project.findByIdAndUpdate(
                args.id, 
                {
                    $set: {
                        name: args.name,
                        description : args.description
                    }
                }),
                {new:true}
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
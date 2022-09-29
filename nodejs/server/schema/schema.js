const {projects,clients} = require('../sampledata.js');
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull,
    GraphQLEnumType
    } = require('graphql');

// moongoose model
const Project = require('../models/Project');
const Client = require('../models/Client');
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
                return Project.findByIdAndDelete(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
const graphql = require('graphql');
const Todo = require('../models/todo');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList
} = graphql;

const todoType = new GraphQLObjectType({
    name: 'Todo',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        hostId: {
            type: GraphQLString
        },
        closable: {
            type: GraphQLBoolean
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        todo: {
            type: new GraphQLList(todoType),
            args: {
                hostId: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                console.log(args)
                if(args.hostId) {
                    return Todo.find({ hostId: args.hostId });
                }

                return null;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo:{
            type: todoType,
            args: {
                title: {
                    type: GraphQLString
                },
                hostId: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                const { title, hostId } = args;
                const todoModel = new Todo({
                    title,
                    hostId,
                    closable: false
                })

                return todoModel.save();
            }
        },
        updateClosable: {
            type: todoType,
            args: {
                id: {
                    type: GraphQLID
                },
                closable: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, args) {
                return Todo.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            closable: args.closable
                        }
                    }
                )
                .catch(err => new Error(err));
            }
        },
        updateTodo: {
            type: todoType,
            args: {
                id: {
                    type: GraphQLID
                },
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                hostId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                closable: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, args) {
                const { id, title, closable } = args;
                return Todo.findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            title,
                            closable
                        }
                    }
                ) 
                .catch(err => new Error(err));    
            }
        },
        removeTodo: {
            type: todoType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                const { id } = args;
                return Todo
                       .findByIdAndRemove(id)
                       .exec()
                       .catch(err => new Error(err))
                ; 
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
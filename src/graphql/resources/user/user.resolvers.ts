import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import { authResolvers } from "../../composable/auth.resolver";

export const userResolvers = {
    User: {
        //type scheme field not trivial need a implementation
        posts: (user: UserInstance, { first = 10, offset = 0 }, { db }: { db: DbConnection }) => {
            return db.Post
                .findAll({
                    where: { author: user.get('id') },
                    limit: first,
                    offset: offset
                }).catch(handleError);
        }
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }) => {
            return db.User
                .findAll({
                    limit: first,
                    offset: offset
                }).catch(handleError);
        },

        user: (parent, { id }, { db }: { db: DbConnection }) => {
            id = parseInt(id);
            return db.User
                .findById(id)
                .then((user: UserInstance) => {
                    throwError(!user, `User with id ${id} not found!`);
                    return user;
                }).catch(handleError)
        },
        currentUser: compose(...authResolvers)((parent, args, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            return db.User
                .findById(authUser.id)
                .then((user: UserInstance) => {
                    throwError(!user, `User with id ${authUser.id} not found!`);
                    return user;
                }).catch(handleError);
        })
    },

    Mutation: {
        createUser: (parent, { input }, { db }: { db: DbConnection }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .create(input, { transaction: t })
            }).catch(handleError);
        },

        updateUser: compose(...authResolvers)((parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id ${authUser.id} not found!`);
                        return user.update(input, { transaction: t });
                    });
            }).catch(handleError)
        }),

        updateUserPassword: compose(...authResolvers)((parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id ${authUser.id} not found!`);
                        return user.update(input, { transaction: t })
                            .then((user: UserInstance) => !!user);
                    })
            }).catch(handleError);
        }),

        deleteUser: compose(...authResolvers)((parent, args, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(authUser.id)
                    .then((user: UserInstance) => {
                        throwError(!user, `User with id ${authUser.id} not found!`);
                        return user.destroy({ transaction: t })
                            .then(user => {
                                //@ts-ignore
                                return !!user;
                            });
                    })
            }).catch(handleError)
        })
    }
}
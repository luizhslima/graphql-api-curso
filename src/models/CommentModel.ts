import * as Sequilize from 'sequelize';
import { BaseModelInterface } from '../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';


export interface CommentAttribute {
    id?: number;
    comment?: string;
    post?: number;
    user?: number;
    createAt?: string;
    updateAt?: string;
}

export interface CommentInstance extends Sequilize.Instance<CommentAttribute> { }

export interface CommentModel extends BaseModelInterface, Sequilize.Model<CommentInstance, CommentAttribute> {

}


export default (sequelize: Sequilize.Sequelize, DataTypes: Sequilize.DataTypes): CommentModel => {
    const Comment: CommentModel = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'comments'
    });

    Comment.associate = (models: ModelsInterface): void => {
        Comment.belongsTo(models.Post, {
            foreignKey: {
                allowNull:false,
                field:'post',
                name:'post'
            }
        });

        Comment.belongsTo(models.User,{
            foreignKey:{
                allowNull:false,
                field:'user',
                name:'user'
            }
        })
    }

    return Comment;
}
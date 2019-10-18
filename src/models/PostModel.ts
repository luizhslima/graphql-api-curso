import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";


export interface PostAttributes {
    id?:number;
    title?:string;
    content?:string;
    photo?: string;
    author?:number;
    createdAt?:string;
    updateAt?:string;
}

export interface PostInstace extends Sequelize.Instance<PostAttributes>{}

export interface PostModel extends BaseModelInterface, Sequelize.Model<PostInstace, PostAttributes>{}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PostModel => {
    const PostModel:PostModel  = sequelize.define('Post', {
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        content:{
            type:DataTypes.STRING,
            allowNull:false
        },
        photo:{
            type: DataTypes.BLOB({
                length:'long'
            }),
            allowNull:false
        }
    }, {
        tableName:'posts'
    });

    //definindo associação das nossas tabelas do banco de dados (relações)
    PostModel.associate = (models: ModelsInterface) : void => {
        PostModel.belongsTo(models.User, {
            foreignKey:{
                allowNull:false,
                field: 'author',
                name: 'author'
            }
        });
    }

    return PostModel;
}
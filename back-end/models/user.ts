import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  ID: number;
  NAME: string;
  SOCKETID: string;
  OPTION:number; // -1 initial, -2 not checked, -3 checked, 0 and 1 game option
  ROOMID?:number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'ID'> {}
function UserModel (sequelize:Sequelize){
  class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
      public ID!: number;
      public NAME!: string;
      public SOCKETID!: string;
      public OPTION!:number;
      public ROOMID?: number;
      // Define associations if needed
      static associate(models: any) {
        User.belongsTo(models.Room, { foreignKey: 'ROOMID' });
      }

      //Create setters and getters 
      public getName():string{
        return this.NAME;
      }
      public getSocketID():string{
        return this.SOCKETID;
      }
      public getOption():number{
        return this.OPTION;
      }
      public getRoomID():number|undefined{
        return this.ROOMID;
      }
      public setName(NAME:string){
        this.NAME = NAME;
      }
      public setSocketID(SOCKETID:string){
        this.SOCKETID = SOCKETID;
      }
      public setOption(OPTION:number){
        this.OPTION = OPTION;
      }
      
    }
      
    User.init(
      {
        ID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        NAME: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        OPTION: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        SOCKETID: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        ROOMID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'ROOM', // 'rooms' refers to table name
              key: 'ID',
            },
          }
      },
      {
        tableName: 'USER',
        sequelize, // passing the `sequelize` instance is required
      }
    );

    
  return User
}

export default UserModel;


import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface RoomAttributes {
  ID: number;
  NAME: string;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'ID'> {}

function RoomModel (sequelize:Sequelize){

    class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  
        public ID!: number;
        public NAME!: string;
        // Define associations if needed
        static associate(models: any) {
            Room.hasMany(models.User, { foreignKey: 'ROOMID' })
            Room.hasOne(models.Game, { foreignKey: 'ROOMID' })
           }
        
      }
      
      Room.init(
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
        },
        {
          tableName: 'ROOM',
          sequelize,
        }
      );
    
    return Room;
}

export default RoomModel;


//database connection

import { Sequelize } from 'sequelize-typescript';
import config from './config';

import RoomModel from '../Models/Room';


export async function initSequelizeDatabase(){
    const env = process.env.NODE_ENV || 'development';
    const sequelizeConfig = config[env];
    
    const sequelize = new Sequelize(sequelizeConfig);
    
    const Room = RoomModel(sequelize);
    
    //This is to sync sequielize modes to db (only in dev mode)
    await sequelize.sync({ force: true }); // Set to `true` to drop and recreate tables
    const newRoom = await Room.create({ NAME:'LOBBY'});
    return sequelize
}
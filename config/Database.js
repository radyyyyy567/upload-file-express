import {Sequelize} from "sequelize";

const db = new Sequelize('postgresql://postgres:12345678@localhost:5432/satu_data_db');

export default db;
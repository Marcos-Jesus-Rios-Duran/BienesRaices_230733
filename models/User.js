import { DataTypes } from 'sequelize';
import db from '../db/config.js';

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
    },
    confirmacion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

export default User;


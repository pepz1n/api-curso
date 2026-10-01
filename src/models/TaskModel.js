import { DataTypes } from 'sequelize';
import { sequelize } from '../config/config.js';
import User from './UserModel.js';

const Task = sequelize.define(
  'tasks',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    done_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      // Ao marcar como concluída, grava a hora atual; ao desmarcar, limpa.
      beforeSave: (task) => {
        if (task.isNewRecord || task.changed('done')) {
          task.set('done_at', task.done ? new Date() : null);
        }
      },
    },
  },
);

Task.belongsTo(User, {
  as: 'User',
  onUpdate: 'NO ACTION',
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'user_id',
    allowNull: false,
    field: 'user_id',
  },
});

User.hasMany(Task, {
  as: 'Tasks',
  foreignKey: 'user_id',
});

export default Task;

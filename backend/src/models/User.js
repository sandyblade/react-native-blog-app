/**
 * This file is part of the Sandy Andryanto Blog Application.
 *
 * @author     Sandy Andryanto <sandy.andryanto.blade@gmail.com>
 * @copyright  2024
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      firstName: {
        field: "first_name",
        type: DataTypes.STRING,
      },
      lastName: {
        field: "last_name",
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
      gender: DataTypes.STRING,
      country: DataTypes.STRING,
      facebook: DataTypes.STRING,
      instagram: DataTypes.STRING,
      twitter: DataTypes.STRING,
      linkedIn: {
        field: "linked_in",
        type: DataTypes.STRING,
      },
      address: DataTypes.STRING,
      jobTitle: {
        field: "job_title",
        type: DataTypes.STRING,
      },
      aboutMe: {
        field: "about_me",
        type: DataTypes.STRING,
      },
      resetToken: {
        field: "reset_token",
        type: DataTypes.STRING,
      },
      confirmToken: {
        field: "confirm_token",
        type: DataTypes.STRING,
      },
      confirmed: DataTypes.INTEGER,
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
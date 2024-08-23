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
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init(
    {
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
      },
      image: DataTypes.STRING,
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.STRING,
      categories: DataTypes.STRING,
      tags: DataTypes.STRING,
      json_categories: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.categories ? JSON.parse(this.categories) : [];
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
      json_tags: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.tags ? JSON.parse(this.tags) : [];
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
      total_viewer: DataTypes.INTEGER,
      total_comment: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
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
      modelName: "Article",
      tableName: "articles",
    }
  );
  return Article;
};
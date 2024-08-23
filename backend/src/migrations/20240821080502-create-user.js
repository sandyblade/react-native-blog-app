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

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("users", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED,
        },
        email: {
          type: Sequelize.STRING(191),
          unique: true,
        },
        phone: {
          type: Sequelize.STRING(191),
          allowNull: true,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
        },
        image: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        first_name: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        gender: {
          type: Sequelize.STRING(2),
          allowNull: true,
        },
        job_title: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        facebook: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        instagram: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        twitter: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        linked_in: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        about_me: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        reset_token: {
          type: Sequelize.STRING(36),
          allowNull: true,
        },
        confirmed: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
        confirm_token: {
          type: Sequelize.STRING(36),
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex("users", ["email"]))
      .then(() => queryInterface.addIndex("users", ["phone"]))
      .then(() => queryInterface.addIndex("users", ["facebook"]))
      .then(() => queryInterface.addIndex("users", ["instagram"]))
      .then(() => queryInterface.addIndex("users", ["twitter"]))
      .then(() => queryInterface.addIndex("users", ["linked_in"]))
      .then(() => queryInterface.addIndex("users", ["password"]))
      .then(() => queryInterface.addIndex("users", ["image"]))
      .then(() => queryInterface.addIndex("users", ["first_name"]))
      .then(() => queryInterface.addIndex("users", ["last_name"]))
      .then(() => queryInterface.addIndex("users", ["job_title"]))
      .then(() => queryInterface.addIndex("users", ["gender"]))
      .then(() => queryInterface.addIndex("users", ["country"]))
      .then(() => queryInterface.addIndex("users", ["reset_token"]))
      .then(() => queryInterface.addIndex("users", ["confirmed"]))
      .then(() => queryInterface.addIndex("users", ["confirm_token"]))
      .then(() => queryInterface.addIndex("users", ["created_at"]))
      .then(() => queryInterface.addIndex("users", ["updated_at"]));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
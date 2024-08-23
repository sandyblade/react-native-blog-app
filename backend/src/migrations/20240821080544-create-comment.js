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

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      article_id: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      parent_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      comment: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => queryInterface.addIndex('comments', ['article_id']))
    .then(() => queryInterface.addIndex('comments', ['parent_id']))
    .then(() => queryInterface.addIndex('comments', ['user_id']))
    .then(() => queryInterface.addIndex('comments', ['created_at']))
    .then(() => queryInterface.addIndex('comments', ['updated_at']))
    ;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};
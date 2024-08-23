/**
 * This file is part of the Sandy Andryanto Company Profile Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.dev@gmail.com>
 * @copyright  2024
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

"use strict";

const faker = require("faker");
const bcrypt = require("bcryptjs");
const plainPassword = "P@ssw0rd!123";

async function createUser() {
  let gender_name = faker.name.gender(true).toLowerCase();
  let first_name = faker.name.firstName(gender_name);
  return {
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.phoneNumber(),
    password: bcrypt.hashSync(plainPassword, 10),
    first_name: first_name,
    last_name: faker.name.lastName(),
    gender: gender_name === 'male' ? "M" : "F",
    country: faker.address.country(),
    job_title: faker.name.jobTitle(),
    address: faker.address.streetAddress(),
    about_me: faker.lorem.paragraphs(),
    facebook: faker.internet.userName(),
    instagram: faker.internet.userName(),
    twitter: faker.internet.userName(),
    linked_in: faker.internet.userName(),
    confirmed: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };
}



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let users = [];
    let i;
    let max = 10;

    for (i = 1; i <= max; i++) {
      let obj = await createUser();
      users.push(obj);
    }

    queryInterface.bulkDelete("users", null, {});
    return queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
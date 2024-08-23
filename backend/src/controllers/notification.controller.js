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

const auth_user = require('../utils/auth_user');
const db = require("../models");
const Notification = db.Notification
const Activity = db.Activity
const { Op } = require("sequelize");

async function list(req, res) {

    let user = await auth_user(req)
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let total = await Notification.count({ where: { user_id: user.id } });
    let offset = ((page-1)*limit)
    let order_by = req.query.order || "id"
    let order_dir = req.query.dir || "desc"
    let searchValue = req.query.search || ""
    let searchData = [ { subject: { [Op.like]: `%${searchValue}%` } }, { message: { [Op.like]: `%${searchValue}%` } }]
    let list  = await Notification.findAll({
        where: { user_id: user.id, [Op.or]: searchData },
        offset: offset,
        limit: limit,
        order: [[order_by, order_dir]],
    })

    res.status(200).send({
        data: { 
            list: list, 
            total: total 
        },
        status: true,
        message: "ok"
    });
    return;

}

async function read(req, res) {

    let id = req.params.id;
    let user = await auth_user(req)
    let notification = await Notification.findOne({
        where: {
            id: id,
            user_id: user.id
        }
    });

    if(!notification){
        res.status(400).send({
            message: "Notification with id " + id + " was not found.!!",
        });
        return;
    }

    let status = parseInt(notification.status)

    if(status === 0){
        await Notification.update({ status: 1, updated_at: new Date() }, {
            where: {
                id: id,
                user_id: user.id
            }
        })
        await Activity.create({
            userId: user.id,
            event: "Read notification",
            description: "The user read notification with subject "+notification.subject
        });
    }

    notification = await Notification.findOne({
        where: {
            id: id,
            user_id: user.id
        }
    });

    res.status(200).send({
        data: notification,
        status: true,
        message: "ok"
    });
    return;

}

async function remove(req, res) {

    let id = req.params.id;
    let user = await auth_user(req)
    let notification = await Notification.findOne({
        where: {
            id: id,
            user_id: user.id
        }
    });

    if(!notification){
        res.status(400).send({
            message: "Notification with id " + id + " was not found.!!",
        });
        return;
    }

    await Activity.create({
        userId: user.id,
        event: "Delete Notification",
        description: "The user delete notification with subject "+notification.subject
    });

    await notification.destroy();

    res.status(200).send({
        data: {},
        status: true,
        message: "ok"
    });
    return;

}

module.exports = {
    list,
    read,
    remove
}
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

const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.User;

async function auth_user(req) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        
        let user_id;
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, authData) => {
            if (err) {
                console.log(err);
            }
            if (authData["sub"]) {
                user_id = authData["sub"]
            }
        })

        if(user_id !== undefined){
            return await User.findOne({
                attributes: {
                    exclude: ["password", "resetToken", "confirmToken", "confirmed"],
                },
                where: {
                    id: user_id
                }
            })
        }

    }
    return undefined
}

module.exports = auth_user
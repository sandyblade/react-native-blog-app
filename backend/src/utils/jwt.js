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

const {
    expressjwt
} = require('express-jwt');

module.exports = jwt

function jwt() {
    const {
        secret
    } = {
        secret: process.env.JWT_SECRET_KEY
    }
    return expressjwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            '/',
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/email/forgot',
            '/api/article/list',
            '/api/comment/list',
            /^\/api\/article\/read\/.*/,
            /^\/api\/auth\/confirm\/.*/,
            /^\/api\/auth\/email\/reset\/.*/,
            /^\/uploads\/.*/,
        ]
    });
}
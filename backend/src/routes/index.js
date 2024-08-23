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

const appRouter = require('express').Router();
const authController = require("../controllers/auth.controller.js");
const accountController = require("../controllers/account.controller.js");
const notificationController = require("../controllers/notification.controller.js");
const articleController = require("../controllers/article.controller.js");
const commentController = require("../controllers/comment.controller.js");
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) 
    }
})
const upload = multer({  storage: storage });

// Auth Pages
appRouter.post('/auth/login', authController.login);
appRouter.post('/auth/register', authController.register);
appRouter.get('/auth/confirm/:token', authController.confirm);
appRouter.post('/auth/email/forgot', authController.forgotPassword);
appRouter.post('/auth/email/reset/:token', authController.resetPassword);

// User account Pages
appRouter.get('/account/token', accountController.token);
appRouter.get('/account/detail', accountController.detail);
appRouter.get('/account/activity', accountController.activity);
appRouter.post('/account/upload', upload.single('file_image'), accountController.upload);
appRouter.post('/account/update', accountController.update);
appRouter.post('/account/password', accountController.password);

// Notification
appRouter.get('/notification/list', notificationController.list);
appRouter.get('/notification/read/:id', notificationController.read);
appRouter.delete('/notification/remove/:id', notificationController.remove);

// Article
appRouter.get('/article/words', articleController.words);
appRouter.get('/article/user', articleController.user);
appRouter.get('/article/list', articleController.list);
appRouter.get('/article/read/:slug', articleController.read);
appRouter.delete('/article/remove/:id', articleController.remove);
appRouter.post('/article/create', articleController.create);
appRouter.put('/article/update/:id', articleController.update);
appRouter.post('/article/upload', upload.single('file_image'), articleController.upload);

// Comment
appRouter.get('/comment/list/:id', commentController.list);
appRouter.post('/comment/create/:id', commentController.create);
appRouter.delete('/comment/remove/:id', commentController.remove);

module.exports = app => {
    app.use('/api', [appRouter]);
};
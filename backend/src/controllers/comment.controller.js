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
const User = db.User;
const Comment = db.Comment;
const Article = db.Article;
const Activity = db.Activity
const Notification = db.Notification
const userExclude = [
    "id",
    "createdAt", 
    "updatedAt", 
    "password", 
    "resetToken", 
    "confirmToken", 
    "confirmed",
    "aboutMe"
]

async function list(req, res) {

    User.hasMany(Comment, {foreignKey: 'user_id'})
       
    Comment.belongsTo(User, {foreignKey: 'user_id'})

    let relations = {
        model: User,
        attributes: { exclude: userExclude }
    }

    let list = await buildTree(relations, req.params.id, null);

    res.status(200).send({
        data: list,
        status: true,
        message: "ok"
    });
    return;
}

async function create(req, res) {

    let article_id = req.params.id;
    let user = await auth_user(req)


    if (!req.body.comment) {
        res.status(400).send({
            message: "The field comment can not be empty!"
        });
        return;
    }

    let article = await Article.findOne({
        where: {
            id: article_id
        }
    });

    if (!article) {
        res.status(400).send({
            message: "Article with id " + article_id + " was not found.!!",
        });
        return;
    }

    let comment = await Comment.create({
        articleId: article_id,
        parentId: req.body.parentId,
        userId: user.id,
        comment: req.body.comment
    });

    let event = req.body.parentId ? "Reply Comment" : "Create Comment"
    let description = req.body.parentId ? "reply" : "add"
    let total_comment = await Comment.count({ where: { articleId: article.id } });

    await Activity.create({
        userId: user.id,
        event: event,
        description: "The user "+user.email+" "+description+" to your article with title `"+article.title+"`."
    });

    await Notification.create({
        userId: article.userId,
        subject: event,
        message: "The user "+user.email+" "+description+" to your article with title `"+article.title+"`.",
        status: 0
    })

    await Article.update({ total_comment: total_comment }, { where: { id : article.id } }) 

    if(req.app.get('io')){
        let bearerHeader = req.headers['authorization'];
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        req.app.get('io').sockets.emit('notification/call', bearerToken);
        req.app.get('io').sockets.emit('comment/article/call', article.slug);
    }

    res.status(200).send({
        data: comment,
        status: true,
        message: "ok"
    });
    return;
}

async function remove(req, res) {
   
    let id = req.params.id;
    let user = await auth_user(req)
    let comment = await Comment.findOne({
        where: {
            id: id,
            user_id: user.id
        }
    });

    if(!comment){
        res.status(400).send({
            message: "Comment with id " + id + " was not found.!!",
        });
        return;
    }

    await Activity.create({
        userId: user.id,
        event: "Delete Comment",
        description: "The user delete comment with subject "
    });

    await comment.destroy();

    res.status(200).send({
        data: {},
        status: true,
        message: "ok"
    });
    return;
}

async function buildTree(relations, article_id, parent_id) {
    let branch = [];
    let comments = await Comment.findAll({
      include: relations,
      where: { articleId: article_id, parentId: parent_id },
      order: [["id", "desc"]],
    });
  
    await Promise.all(
      comments.map(async (comment) => {
  
        let obj = {
           "id": comment.id,
           "parentId": comment.parentId,
           "comment": comment.comment,
           "created_at": comment.createdAt,
           "user": comment.User
        }
  
        let children = await buildTree(relations, article_id, comment.id)
        
        if(children.length > 0){
          obj["children"] = children;
        }else{
          obj["children"] = [];
        }
  
        branch.push(obj);
      })
    );
  
    return branch;
  }

module.exports = {
    list,
    remove,
    create,
}
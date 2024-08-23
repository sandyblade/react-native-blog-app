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

const db = require("../models");
const Notification = db.Notification
const Comment = db.Comment
const Article = db.Article
const User = db.User
const jwt = require('jsonwebtoken');
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

async function notification(token) {

    let user_id

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            console.log(err);
        }
        if (authData["sub"]) {
            user_id = authData["sub"]
        }
    })

    return await Notification.findOne({
        order: [["id", "desc"]],
        where: {
            status: 0,
            userId: user_id
        }
    });
}

async function comment(slug) {

    User.hasMany(Comment, {foreignKey: 'user_id'})
       
    Comment.belongsTo(User, {foreignKey: 'user_id'})

    let relations = {
        model: User,
        attributes: { exclude: userExclude }
    }

    let article = await Article.findOne({
        where: {
            slug: slug
        }
    });

    return await buildTree(relations, article.id, null);
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
    notification,
    comment
}
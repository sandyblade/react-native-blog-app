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
const slugify = require('slugify')
const User = db.User;
const Viewer = db.Viewer;
const Article = db.Article;
const Activity = db.Activity
const Notification = db.Notification
const faker = require("faker");
const { Op } = require("sequelize");
const userExclude = [
    "id",
    "createdAt", 
    "updatedAt", 
    "password", 
    "resetToken", 
    "confirmToken", 
    "confirmed"
]

async function user(req, res) {
   
    let user = await auth_user(req)
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let total = await Article.count({ where: {  user_id: user.id,  status: 1 } });
    let offset = ((page-1)*limit)
    let order_by = req.query.order || "id"
    let order_dir = req.query.dir || "desc"
    let searchValue = req.query.search || ""

    User.hasMany(Article, {foreignKey: 'user_id'})
       
    Article.belongsTo(User, {foreignKey: 'user_id'})

    let searchData = [ 
        { title: { [Op.like]: `%${searchValue}%` } }, 
        { categories: { [Op.like]: `%${searchValue}%` } }, 
        { tags: { [Op.like]: `%${searchValue}%` } }, 
        { description: { [Op.like]: `%${searchValue}%` } },
        { content: { [Op.like]: `%${searchValue}%` } }
    ]

    let list  = await Article.findAll({
        include: [{
            model: User,
            attributes: { exclude: userExclude }
        }],
        where: { user_id: user.id, status: 1, [Op.or]: searchData },
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

async function list(req, res) {
   
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let total = await Article.count({ where: { status: 1 } });
    let offset = ((page-1)*limit)
    let order_by = req.query.order || "id"
    let order_dir = req.query.dir || "desc"
    let searchValue = req.query.search || ""

    User.hasMany(Article, {foreignKey: 'user_id'})
       
    Article.belongsTo(User, {foreignKey: 'user_id'})

    let searchData = [ 
        { title: { [Op.like]: `%${searchValue}%` } }, 
        { categories: { [Op.like]: `%${searchValue}%` } }, 
        { tags: { [Op.like]: `%${searchValue}%` } }, 
        { description: { [Op.like]: `%${searchValue}%` } },
        { content: { [Op.like]: `%${searchValue}%` } }
    ]

    let list  = await Article.findAll({
        include: [{
            model: User,
            attributes: { exclude: userExclude }
        }],
        where: { status: 1, [Op.or]: searchData },
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

    let slug = req.params.slug;

    User.hasMany(Article, {foreignKey: 'user_id'})
       
    Article.belongsTo(User, {foreignKey: 'user_id'})

    let article = await Article.findOne({
        include: [{
            model: User,
            attributes: { exclude: userExclude }
        }],
        where: { slug: slug } 
    });

    if(!article){
        res.status(400).send({
            message: "Article with slug " + slug + " was not found.!!",
        });
        return;
    }

    let session = await auth_user(req)
    if(session !== undefined){
        let viewer = await Viewer.findOne({ where: { userId: session.id, articleId: article.id } });
        if(!viewer){
            await Viewer.create({
                userId: session.id, 
                articleId: article.id,
                status: 0
            });
            let total_viewer = await Viewer.count({ where: { articleId: article.id } });
            await Article.update({ total_viewer: total_viewer }, { where: { id : article.id } }) 
            await Notification.create({
                userId: article.userId,
                subject: "Read Article",
                message: "The user "+session.email+" add read your article with title `"+article.title+"`.",
                status: 0
            })
        }
    }

    article = await Article.findOne({
        include: [{
            model: User,
            attributes: { exclude: userExclude }
        }],
        where: { slug: slug } 
    });

    res.status(200).send({
        data: article,
        status: true,
        message: "ok"
    });
    return;

}

async function remove(req, res) {

    let id = req.params.id;
    let user = await auth_user(req)
    let article = await Article.findOne({
        where: {
            id: id,
            user_id: user.id
        }
    });

    if(!article){
        res.status(400).send({
            message: "Article with id " + id + " was not found.!!",
        });
        return;
    }

    await Activity.create({
        userId: user.id,
        event: "Delete Article",
        description: "The user delete article with title "+article.title
    });

    await article.destroy();

    res.status(200).send({
        data: {},
        status: true,
        message: "ok"
    });
    return;

}

async function create(req, res) {

    if (!req.body.title) {
        res.status(400).send({
            message: "The field title can not be empty!"
        });
        return;
    }

    if (!req.body.description) {
        res.status(400).send({
            message: "The field description can not be empty!"
        });
        return;
    }

    if (!req.body.content) {
        res.status(400).send({
            message: "The field content can not be empty!"
        });
        return;
    }

    if (!req.body.status) {
        res.status(400).send({
            message: "The field status can not be empty!"
        });
        return;
    }
    
    let user = await auth_user(req)
    let title = req.body.title
    let slug = slugify(title)
    let image = req.body.image
    let description = req.body.description
    let content = req.body.content
    let categories = req.body.categories
    let tags = req.body.tags
    let status = req.body.status
    let article = await Article.findOne({ where: { slug: slug } })

    if (article) {
        res.status(400).send({
            message: "The article with title `"+title+"` has already been taken.!"
        });
        return;
    }

    let newArticle = await Article.create({
        userId: user.id,
        image: image,
        title: title,
        slug: slug,
        description: description,
        content: content,
        status: status,
        categories: categories ? JSON.stringify(categories) : JSON.stringify([]),
        tags: tags ? JSON.stringify(categories) : JSON.stringify([]),
    });

    await Activity.create({
        userId: user.id,
        event: "Create New Article",
        description: "A new article with title `"+title+"` has been created. "
    });

    

    res.status(200).send({
        data: newArticle,
        status: true,
        message: "ok"
    });
    return;

}

async function update(req, res) {


    let id = req.params.id;
    let user = await auth_user(req)
    let article = await Article.findOne({
        where: {
            id: id,
            user_id: user.id
        }
    });

    if(!article){
        res.status(400).send({
            message: "Article with id " + id + " was not found.!!",
        });
        return;
    }

    if (!req.body.title) {
        res.status(400).send({
            message: "The field title can not be empty!"
        });
        return;
    }

    if (!req.body.description) {
        res.status(400).send({
            message: "The field description can not be empty!"
        });
        return;
    }

    if (!req.body.content) {
        res.status(400).send({
            message: "The field content can not be empty!"
        });
        return;
    }

    if (!req.body.status) {
        res.status(400).send({
            message: "The field status can not be empty!"
        });
        return;
    }
    
    let title = req.body.title
    let slug = slugify(title)
    let image = req.body.image
    let description = req.body.description
    let content = req.body.content
    let categories = req.body.categories
    let tags = req.body.tags
    let status = req.body.status
    let articleOther = await Article.findOne({
       where: {
            id: {[Op.not]: id},
            slug: slug 
       }
    })

    if (articleOther) {
        res.status(400).send({
            message: "The article with title `"+title+"` has already been taken.!"
        });
        return;
    }

    await Article.update({
        image: image,
        title: title,
        slug: slug,
        description: description,
        content: content,
        status: status,
        categories: categories,
        tags: tags,
        updated_at: new Date()
    }, { where: { id : id } }) 

    

    await Activity.create({
        userId: user.id,
        event: "Update Article",
        description: "The user editing article with title "+article.title
    });

    articleOther = await Article.findOne({ where: { slug: slug } })

    res.status(200).send({
        data: articleOther,
        status: true,
        message: "ok"
    });
    return;
}

async function words(req, res) {

    let max = req.body.max || 100
    let data = []

    for(let i = 1; i <= max ;i++){
        let string = faker.random.words()
        data.push(string.charAt(0).toUpperCase() + string.slice(1))
    }

    data = data.toSorted()
    let uniq = [...new Set(data)]

    res.status(200).send({
        data: uniq,
        status: true,
        message: "ok"
    });
    return;

}

async function upload(req, res) {
    if (req.file) {
        let file = req.file
        let fileUrl = file.destination + "" + file.filename
        res.status(200).send({
            data: {
                image: fileUrl
            },
            status: true,
            message: "Your upload file has been successfully !!"
        });
    } else {
        res.status(400).send({
            message: "The file input is empty!"
        });
        return;
    }
}

module.exports = {
    list,
    user,
    read,
    remove,
    create,
    update,
    words,
    upload
}
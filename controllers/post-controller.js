const TodoModel = require('../models/todo-model');
const mongoose = require('mongoose')
const PostAccessModel = require('../models/post-access-model')
const postService = require('../service/post-service')

class PostController {
    async getAllPosts(req, res, next) {
        try {
            const todos = await TodoModel.find({ userId: req.user.id });
            return res.json(todos);
        } catch (e) {
            next(e);
        }
    }
    async getAllPostsByUserId(req, res, next) {
        try {
            const currentUser = req.user.id;
            const userId = req.params.userId;
            const accessPostList = await PostAccessModel.find({ userId: userId });
            const postIdsWithAccessForCurrentUser = accessPostList.reduce((acc, { _id, postId, blackListUserIds, userId }) => {
                if (blackListUserIds.includes(currentUser)) {
                    return acc;
                }
                acc.push(postId);
                return acc;
            }, [])

            const posts = await TodoModel.find({ _id: { $in: postIdsWithAccessForCurrentUser } })

            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }


    async getPostById(req, res, next) {
        try {
            const postId = req.params.postId
            const post = await TodoModel.findOne({ _id: postId });
            return res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async denyAccess(req, res, next) {
        try {
            const postId = req.params.postId
            const { banUserIds } = req.body
            const postAccessDeny = await postService.denyAccess(postId, banUserIds);
            return res.json(postAccessDeny);
        } catch (e) {
            next(e);
        }
    }

    async allowAccess(req, res, next) {
        try {
            const postId = req.params.postId
            const { unBanUserIds } = req.body
            const imgAccessDeny = await postService.allowAccess(postId, unBanUserIds);
            return res.json(imgAccessDeny);
        } catch (e) {
            next(e);
        }
    }


    async createPost(req, res, next) {
        try {
            const { title } = req.body
            const titleData = await TodoModel.create({ title, userId: req.user.id, _id: mongoose.Types.ObjectId() })
            await titleData.save()

            const postAccess = await PostAccessModel.create({ userId: req.user.id, _id: mongoose.Types.ObjectId(), postId: titleData._id })
            await postAccess.save()

            return res.json(titleData)

        } catch (e) {
            next(e);
        }
    }

    async updatePost(req, res, next) {
        try {
            const postId = req.params.postId
            const { title } = req.body
            const newTitleData = await TodoModel.updateOne({ _id: postId, userId: req.user.id }, { $set: { title } })
            return res.json(newTitleData)

        } catch (e) {
            next(e);
        }
    }

    async deletePost(req, res, next) {
        try {
            const postId = req.params.postId
            const deletePost = await TodoModel.deleteOne({ _id: postId, userId: req.user.id })
            return res.json(deletePost)
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new PostController();


const TodoModel = require('../models/todo-model');
const PostAccessModel = require('../models/post-access-model')


class PostService {
    async getAllPostsByUserId(currentUser, userId) {
        const accessPostList = PostAccessModel.find({ userId });
        const postIdsWithAccessForCurrentUser = accessPostList.reduce((acc, { _id, postId, blackListUserIds, userId }) => {
            if(blackListUserIds.includes(currentUser)) {
                return;
            }
            acc.push(postId);
            return acc;
        }, [])
        
        TodoModel.find({ _id: { $in: postIdsWithAccessForCurrentUser }}) 
    } 

    async denyAccess(postId, banUserIds) {
        const denyAccess = PostAccessModel.updateOne({ postId: postId}, { $addToSet: {blackListUserIds: banUserIds}})
        return denyAccess
    }
    
    async allowAccess(postId, unBanUserIds) {
        const denyAccess = PostAccessModel.updateOne({ postId: postId}, { $pull: {blackListUserIds: unBanUserIds}})
        return denyAccess
    }

}

module.exports = new PostService();
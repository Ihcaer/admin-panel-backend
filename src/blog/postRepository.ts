import Post from "./postModel.js";

class PostRepository {
   async getUniqueTags(): Promise<string[]> {
      const uniqueTags = await Post.aggregate([
         { $unwind: '$tags' },
         { $group: { _id: '$tags' } },
         { $project: { _id: 0, tag: '$_id' } }
      ]);

      const tags = uniqueTags.map((post) => post.tag);
      return tags;
   }
}

export default PostRepository;
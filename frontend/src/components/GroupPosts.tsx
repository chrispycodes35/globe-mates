import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageSquare, ThumbsUp, Send } from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  timestamp: any;
  likes: string[];
  commentCount: number;
}

interface GroupPostsProps {
  groupId: string;
  currentUserId: string;
  currentUserName: string;
}

const GroupPosts = ({ groupId, currentUserId, currentUserName }: GroupPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const postsRef = collection(db, 'groups', groupId, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = [];
      snapshot.forEach((doc) => {
        postsData.push({
          id: doc.id,
          ...doc.data(),
          commentCount: 0,
        } as Post);
      });
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim() || posting) return;

    setPosting(true);
    try {
      const postsRef = collection(db, 'groups', groupId, 'posts');
      await addDoc(postsRef, {
        userId: currentUserId,
        userName: currentUserName,
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        timestamp: serverTimestamp(),
        likes: [],
      });

      setNewPostTitle('');
      setNewPostContent('');
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Create Post Button */}
      <div className="mb-6">
        {!showCreatePost ? (
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Create New Post
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Post</h3>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3"
                disabled={posting}
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3"
                disabled={posting}
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={!newPostTitle.trim() || !newPostContent.trim() || posting}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreatePost(false);
                    setNewPostTitle('');
                    setNewPostContent('');
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={posting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    by {post.userName} • {formatDate(post.timestamp)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center space-x-6 text-gray-500 text-sm pt-4 border-t border-gray-200">
                <button className="flex items-center space-x-2 hover:text-pink-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes?.length || 0} likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-pink-600 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentCount} comments</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupPosts;

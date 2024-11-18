import PostCard from '@/components/HomeComponents/PostCard';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCookie } from '@/utils';
import PostCardSkelton from '@/components/HomeComponents/PostCardSkelton';

const HomePage = () => {
  const {} = useSelector((state) => state.users);

  const [posts, setPosts] = useState([]);
  const [posts2, setPosts2] = useState([
    {
      id: 1,
      profile: {
        username: "johndoe",
        profile_picture: "https://via.placeholder.com/50",
        full_name: "John Doe",
      },
      created_at: "2023-11-15T12:00:00Z",
      content: "This is a test post with a beautiful image.",
      image: "https://via.placeholder.com/600",
      user_liked: false,
      like_count: 10,
      comment_count: 5,
    },
    {
      id: 2,
      profile: {
        username: "janedoe",
        profile_picture: "https://via.placeholder.com/50",
        full_name: "Jane Doe",
      },
      created_at: "2023-11-16T14:00:00Z",
      content: "Another test post with a scenic background.",
      image: "https://via.placeholder.com/600/92c952",
      user_liked: true,
      like_count: 25,
      comment_count: 12,
    },
    {
      id: 3,
      profile: {
        username: "user123",
        profile_picture: "https://via.placeholder.com/50",
        full_name: "User 123",
      },
      created_at: "2023-11-17T10:30:00Z",
      content: "A placeholder post to test layout and design.",
      image: "https://via.placeholder.com/600/771796",
      user_liked: false,
      like_count: 15,
      comment_count: 8,
    },
  ]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const access = getCookie('accessToken');
  const initialUrl = `${import.meta.env.VITE_API_URL}/api/profile/recommend/posts/`;
  const [url, setUrl] = useState(initialUrl);

  const fetchPost = async () => {
    if (!url) return;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const data = await response.json();
      console.log("Data : " + data);
      if (response.ok) {
        setPosts((prevPosts) => [...prevPosts, ...data.results]);
        setCount((prevCount) => prevCount + data.results.length);
        setHasMore(data?.next ? true : false);
        setUrl(data.next);
      } else {
        console.log('Failed to fetch posts');
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div id="scrollableDiv" className="flex flex-col gap-10 w-full py-4 h-[90vh] mt-10 overflow-y-auto">
      <InfiniteScroll
        dataLength={count}
        next={fetchPost}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        loader={
          <>
            <PostCardSkelton />
            <PostCardSkelton />
            <PostCardSkelton />
          </>
        }
      >
        {/* {posts.map((post) => (
          <PostCard post={post} key={post.id} setPosts={setPosts} />
        ))} */}
        {posts2.map((post) => (
          <PostCard post={post} key={post.id} setPosts={setPosts} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;

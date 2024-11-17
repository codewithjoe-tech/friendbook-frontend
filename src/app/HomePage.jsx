import PostCard from '@/components/HomeComponents/PostCard';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCookie } from '@/utils';
import PostCardSkelton from '@/components/HomeComponents/PostCardSkelton';

const HomePage = () => {
  const {} = useSelector((state) => state.users);

  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(true); 
  const access = getCookie('accessToken');
  const initialUrl = `${import.meta.env.VITE_API_URL}/api/profile/recommend/posts/`;
  const [url, setUrl] = useState(initialUrl);

  const fetchPost = async () => {
    if (!url) return; 
    console.log(url)
    try {
      const response = await fetch(url, {
        method:"GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const data = await response.json();
      console.log("Data : "+data)
      if (response.ok) {
        setPosts((prevPosts) => [...prevPosts, ...data.results]);
        setCount((prevCount) => prevCount + data.results.length);
        setHasMore(data?.next?true:false);
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
        loader={<>
        <PostCardSkelton />
        <PostCardSkelton />
        
        <PostCardSkelton />
       
        </>}
      >
        {posts.map((post) => (
          <PostCard post={post} key={post.id}  setPosts={setPosts} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;

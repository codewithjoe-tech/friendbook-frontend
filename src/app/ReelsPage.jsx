import React, { useState, useEffect } from 'react';
import { getCookie } from '@/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReelCard from '@/components/HomeComponents/ReelCard';
import ReelCardSkelton from '@/components/HomeComponents/ReelCardSkelton';
const dummyReels = [
  {
    id: 1,
    profile: {
      username: "john_doe",
      full_name: "John Doe",
      profile_picture: "https://via.placeholder.com/150",
    },
    created_at: new Date().toISOString(),
    thumbnail: "https://via.placeholder.com/300x600",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    user_liked: false,
    like_count: 10,
    comment_count: 5,
  },
  {
    id: 2,
    profile: {
      username: "jane_doe",
      full_name: "Jane Doe",
      profile_picture: "https://via.placeholder.com/150",
    },
    created_at: new Date().toISOString(),
    thumbnail: "https://via.placeholder.com/300x600",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    user_liked: true,
    like_count: 25,
    comment_count: 8,
  },
  {
    id: 3,
    profile: {
      username: "sam_smith",
      full_name: "Sam Smith",
      profile_picture: "https://via.placeholder.com/150",
    },
    created_at: new Date().toISOString(),
    thumbnail: "https://via.placeholder.com/300x600",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    user_liked: false,
    like_count: 40,
    comment_count: 12,
  },
];

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const access = getCookie('accessToken');
  const initialUrl = `${import.meta.env.VITE_API_URL}/api/profile/recommend/reels/`;
  const [url, setUrl] = useState(initialUrl);

  // Dummy reels data for testing

  const fetchReels = async () => {
    if (!url) return;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setReels((prevReels) => [...prevReels, ...data.results]);
        setCount((prevCount) => prevCount + data.results.length);
        setHasMore(!!data.next); // Set to true if there's a next page
        setUrl(data.next);
      } else {
        console.error('Failed to fetch reels');
      }
    } catch (error) {
      console.error('Error fetching reels:', error);

      // Use dummy reels for testing when API fails
      if (reels.length === 0) {
        setReels(dummyReels);
        setCount(dummyReels.length);
        setHasMore(false);
      }
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col w-full py-4 h-[80vh] overflow-y-scroll mt-20"
    >
      <InfiniteScroll
        dataLength={count}
        next={fetchReels}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        loader={<ReelCardSkelton />}
        endMessage={
          !hasMore && (
            <p className="text-center mt-4 text-gray-500">
              No more reels to load
            </p>
          )
        }
      >
        <div className="flex flex-col gap-4 px-4 ">
          {reels.map((reel) => (
            <ReelCard reel={reel} key={reel.id} setReels={setReels} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ReelsPage;

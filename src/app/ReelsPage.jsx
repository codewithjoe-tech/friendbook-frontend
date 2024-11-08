import React, { useState, useEffect } from 'react';
import { getCookie } from '@/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReelCard from '@/components/HomeComponents/ReelCard';
import ReelCardSkelton from '@/components/HomeComponents/ReelCardSkelton';

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const access = getCookie('accessToken');
  const initialUrl = `${import.meta.env.VITE_API_URL}/api/profile/recommend/reels/`;
  const [url, setUrl] = useState(initialUrl);

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
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col gap-10 w-full py-4 h-[80vh] mt-5 overflow-y-scroll"
      // style={{ minHeight: '100vh' }} 
    >
      <InfiniteScroll
        dataLength={count}
        next={fetchReels}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        loader={<ReelCardSkelton />}
        endMessage={
          reels.length === 1 && !hasMore ? (
            <p className="text-center mt-4">No more reels to load</p>
          ) : null
        }
      >
        {reels.map((reel) => (
          <ReelCard reel={reel} key={reel.id} setReels={setReels} />
        ))}
        {reels.length === 1 && hasMore && <ReelCardSkelton />}
      </InfiniteScroll>
    </div>
  );
};

export default ReelsPage;


import Cookies from 'js-cookie';

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options);
};

export const deleteCookie = (name) => {
  Cookies.remove(name);
};

export const updateCookie = (name, value, options = {}) => {
  if (Cookies.get(name)) {
    Cookies.set(name, value, options);
  }
};


export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'm', seconds: 2592000 },
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}`;
    }
  }

  return 'just now';
};


export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  
  const options = {
    year: 'numeric',
    month: 'short',    
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true       
  };

  return date.toLocaleString('en-US', options);
}
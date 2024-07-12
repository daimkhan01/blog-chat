import axios from "axios";

export const fetchPosts = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};

export const fetchComment = async (commentId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments/${commentId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comment");
  }
  return response.json();
};

// api for PostComment view
export const fetchPost = async (postId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
};

export const fetchComments = async (postId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

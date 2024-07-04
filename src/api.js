import axios from "axios";

export const fetchPosts = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};

export const fetchComments = async (postId) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  return response.data;
};

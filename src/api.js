import axios from "axios";

// Fetch all posts
export const fetchPosts = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};

// Fetch a single post by ID
export const fetchPost = async (postId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
};

// Fetch comments for a post by post ID
export const fetchComments = async (postId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

// Fetch a single comment by ID
export const fetchComment = async (commentId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments/${commentId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comment");
  }
  return response.json();
};

// Update a post by ID
export const updatePost = async (postId, postData) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update post");
  }
  return response.json();
};

// Delete a post by ID
export const deletePost = async (postId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
  return response.json();
};

// Update a comment by ID
export const updateComment = async (commentId, commentData) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments/${commentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update comment");
  }
  return response.json();
};

// Delete a comment by ID
export const deleteComment = async (commentId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
  return response.json();
};

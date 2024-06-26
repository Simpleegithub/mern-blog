/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Alert, Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from './Comment';  // Ensure the Comment component is imported

function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [commentError, setCommentError] = useState(null); 
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    if (comment.length === 0) {
      setCommentError("No Comments yet !");
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser.user._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "POST"
      });

      if (res.ok) {
        const data = await res.json();
        setComments(comments.map(comment =>
          comment._id === commentId ? { ...comment, likes: data.likes, numberOflikes: data.numberOflikes } : comment
        ));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (commentId, editedContent) => {
    setComments(comments.map(comment => 
      comment._id === commentId ? { ...comment, content: editedContent } : comment
    ));
  };

  const handleDelete = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed In as:</p>
          <img
            src={currentUser.user.profilePicture}
            className="h-5 w-5 object-cover rounded-full"
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-sx text-cyan-500 hover:underline"
          >
            @{currentUser.user.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to="/sign-in" className="text-blue-500">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 p-3 rounded-md"
        >
          <Textarea
            placeholder="Add a Comment...."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex flex-row justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters left remaining
            </p>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert className="mt-5" color="failure">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {comments.length > 0 && (
        <>
          <div className="text-sm my-2 flex items-center gap-1">
            <p>Comments:</p>
            <div className="border border-gray-500 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;

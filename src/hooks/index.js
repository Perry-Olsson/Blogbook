import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import userService from "../services/users";
import {
  saveLike,
  saveRemoveLike,
  setLikes,
  logoutUser,
  createNotification,
} from "../reducers";

export const useLikeBlog = (blog, user) => {
  const dispatch = useDispatch();

  if (!blog || !user) return null;

  const like = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    user.likes[blog.id] = true;
    dispatch(saveLike(user, updatedBlog));
  };

  const removeLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes - 1 };
    delete user.likes[blog.id];
    dispatch(saveRemoveLike(user, updatedBlog));
  };
  return [like, removeLike];
};

export const useField = (type, id) => {
  const [value, setValue] = useState("");

  const onChange = event => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return [
    {
      id,
      type,
      value,
      onChange,
      name: id,
    },
    reset,
  ];
};

export const useGetAndSetLikes = () => {
  const dispatch = useDispatch();

  const handleError = error => {
    if (error.response) {
      if (error.response.data.error === "User not found")
        dispatch(logoutUser());
      else
        dispatch(
          createNotification({
            type: "danger",
            message: error.response.data.error,
          })
        );
    } else {
      dispatch(
        createNotification({
          type: "danger",
          message: "Oops something went wrong on the server :(",
        })
      );
      console.log(error.response);
    }
  };

  const main = async user => {
    try {
      const response = await userService.getLikes(user);
      dispatch(setLikes(response.likes));
    } catch (e) {
      handleError(e);
    }
  };

  return main;
};

export const useDarkMode = userTheme => {
  const [theme, setTheme] = useState(userTheme || "light");

  const setMode = async (mode, id) => {
    if (id) {
      const userFromDb = await userService.setTheme({ theme: mode }, id);
      window.localStorage.setItem("theme", userFromDb.theme);
      setTheme(userFromDb.theme);
    } else {
      window.localStorage.removeItem("theme");
      setTheme("light");
    }
  };

  const themeToggler = (userId, mode) => {
    if (mode) {
      setMode(mode, userId);
    } else
      theme === "light" ? setMode("dark", userId) : setMode("light", userId);
  };

  return [theme, themeToggler];
};

export const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

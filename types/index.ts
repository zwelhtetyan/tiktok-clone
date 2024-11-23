export interface Video {
  caption: string;
  video: {
    asset: {
      _id: string;
      url: string;
    };
  };
  _id: string;
  postedBy: {
    _id: string;
    userName: string;
    image: string;
    follower: { _key: string; _ref: string; _type: string }[];
    following: { _key: string; _ref: string; _type: string }[];
    isFollowed?: boolean;
  };
  likes: {
    _ref: string;
  }[];
  isLiked: boolean;
  totalLikes: number;
  comments: {
    comment: string;
    _key: string;
    postedBy: {
      _ref?: string;
      _id?: string;
      userName?: string;
      image?: string;
    };
  }[];
  userId: string;
  _createdAt?: string;
}

export interface User {
  _id: string;
  userName: string;
  image: string;
  _type?: string;
  bio?: string;
  follower?: { _key: string; _ref: string; _type: string }[];
  following?: { _key: string; _ref: string; _type: string }[];
}

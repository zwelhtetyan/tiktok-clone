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
  };
  likes: {
    _ref: string;
  }[];
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
  _type: string;
  userName: string;
  image: string;
}

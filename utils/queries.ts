export const getAllPostsByLimit = (userId: string) => {
  const query = `*[_type == "post"] | order(_createdAt desc) [1...10] {
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
      postedBy->{
        _id,
        userName,
        image,
        follower,
        following,
        "isFollowed": "${userId}" in follower[]._ref,
      },
    likes,
    "isLiked": "${userId}" in likes[]._ref,
    "totalLikes": count(likes),
    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    },
    _createdAt,
  }`;

  return query;
};

export const postDetailQuery = (postId: string | string[], userId: string) => {
  const query = `*[_type == "post" && _id == '${postId}']{
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image,
      follower,
      following,
      "isFollowed": "${userId}" in follower[]._ref,
    },
    likes,
    "isLiked": "${userId}" in likes[]._ref,
    "totalLikes": count(likes),
    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    },
    _createdAt
  }`;
  return query;
};

export const searchUsersQuery = (searchTerm: string | string[]) => {
  const query = `*[_type == "user" && userName match '${searchTerm}*']`;

  return query;
};

export const searchPostsQuery = (searchTerm: string | string[]) => {
  const query = `*[_type == "post" && caption match '${searchTerm}*' || topic match '${searchTerm}*'] {
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
    userId,
    postedBy->{
      _id,
      userName,
      image,
      follower,
      following
    },
    likes,
    "totalLikes": count(likes),
  }`;

  return query;
};

export const singleUserQuery = (userId: string | string[]) => {
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

//TODO: add pagination
export const allUsersQuery = () => {
  const query = `*[_type == "user"] [0...30]`;

  return query;
};

export const userCreatedPostsQuery = (userId: string | string[]) => {
  const query = `*[ _type == 'post' && userId == '${userId}'] | order(_createdAt desc){
    _id,
    caption,
      video{
       asset->{
         _id,
         url
       }
     },
     userId,
     postedBy->{
       _id,
       userName,
       image,
       follower,
       following,
     },
   likes,
   "totalLikes": count(likes),
 }`;

  return query;
};

export const userLikedPostsQuery = (userId: string | string[]) => {
  const query = `*[_type == 'post' && '${userId}' in likes[]._ref ] | order(_createdAt desc) {
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image
    },
    likes,
    "totalLikes": count(likes),
  }`;

  return query;
};

export const topicPostsQuery = (topic: string | string[], userId: string) => {
  const query = `*[_type == "post" && topic match '${topic}*'] | order(_createdAt desc) [1...10] {
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
      postedBy->{
        _id,
        userName,
        image,
        follower,
        following,
        "isFollowed": "${userId}" in follower[]._ref,
      },
    likes,
    "isLiked": "${userId}" in likes[]._ref,
    "totalLikes": count(likes),
    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    },
    _createdAt,
  }`;

  return query;
};

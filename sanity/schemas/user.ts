export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'UserName',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'string',
    },
    {
      name: 'following',
      title: 'Following',
      type: 'array',
      of: [{type: 'postedBy'}],
    },
    {
      name: 'follower',
      title: 'Follower',
      type: 'array',
      of: [{type: 'postedBy'}],
    },
  ],
}

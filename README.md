<h2 align='center'>TikTok clone | video sharing web app</h2>

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ia7odl3vkqcurq6v91s.png)

<p align='center'>
  <img  src='https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6z1029fv99zdmni361i3.png' />
</p>

### Features

- Authentication 🔑 - (login | logout with google auth provider)
- Upload Video 🎞
- Delete (videos | comments) by author 🤔🫣
- Video Detail ✨
- Different Topic page 👀✨
- Search (by topic | by keywords) 👀🔎
- User Profile 🧸👩🏿‍💻 (editable bio)
- Follow | Unfollow  👥
- Like | Comment ❤️‍🔥💬
- Social share 🌍🚀 (native sharing mechanism on mobile device)
- Theme 🌞🌙 (light | dark)
- Progressive web app (PWA) 🚀🔥
- Fully Responsive 📱💻


### Tech stack

- **Frontend** - [Nextjs](https://nextjs.org/)
- **Type checking** - [Typescript](https://www.typescriptlang.org/)
- **Backend** - [Sanity](https://www.sanity.io/)
- **Styling** - [Tailwindcss](https://tailwindcss.com/)
- **UI Component** - [HeadlessUI](https://headlessui.com/)
- **Auto play on scroll** - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- **Authentication** - [Nextauth](https://next-auth.js.org/)
- **State management** - [Zustand](https://zustand-demo.pmnd.rs/)

<!-- Run Locally -->

### :running: Run Locally

Clone the project

```bash
  git@github.com:zwelhtetyan/tiktok-clone.git
```

Go to the project directory

```bash
  cd tiktok-clone
```

Remove remote origin

```bash
  git remote remove origin
```

Install dependencies

```bash
  yarn
```

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`NEXT_PUBLIC_SANITY_TOKEN` - (`your sanity token`)

`GOOGLE_CLIENT_ID` - (`your google client id`)

`GOOGLE_CLIENT_SECRET` - (`your google client secret`)

`NEXT_PUBLIC_ROOT_URL` - (`http://localhost:3000`)

### Start the server

##### Project

```bash
  yarn dev
```

##### Sanity studio

```bash
  cd sanity
  yarn dev
```

<!-- Contributing -->

### :wave: Contributing

<a href="https://github.com/Louis3797/awesome-readme-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Louis3797/awesome-readme-template" />
</a>

##### Contributions are always welcome!

<!-- Contact -->

### Author

#### [Zwel](https://www.linkedin.com/in/zwelhtetyan/)

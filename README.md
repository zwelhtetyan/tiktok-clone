<h2 align='center'>TikTok clone | video sharing web app</h2>

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ia7odl3vkqcurq6v91s.png)

<p align='center'>
  <img  src='https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6z1029fv99zdmni361i3.png' />
</p>

### Features

- [x] Authentication 🔑 - (login | logout with google auth provider)
- [x] Upload Video 🎞
- [x] Delete (videos | comments) by author 🤔🫣
- [x] Video Detail ✨
- [x] Different Topic page 👀✨
- [x] Search (by topic | by keywords) 👀🔎
- [x] User Profile 🧸👩🏿‍💻 (editable bio)
- [x] Follow | Unfollow 👥
- [x] Like | Comment ❤️‍🔥💬
- [x] Social share 🌍🚀 (native sharing mechanism on mobile device)
- [x] Theme 🌞🌙 (light | dark)
- [x] Progressive web app (PWA) 🚀🔥
- [x] Fully Responsive 📱💻

### Tech stack

- [x] **Frontend** - [Nextjs](https://nextjs.org/)
- [x] **Type checking** - [Typescript](https://www.typescriptlang.org/)
- [x] **Backend** - [Sanity](https://www.sanity.io/)
- [x] **Styling** - [Tailwindcss](https://tailwindcss.com/)
- [x] **UI Component** - [HeadlessUI](https://headlessui.com/)
- [x] **Auto play on scroll** - [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [x] **Authentication** - [Nextauth](https://next-auth.js.org/)
- [x] **State management** - [Zustand](https://zustand-demo.pmnd.rs/)

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
  npm install
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
  npm run dev
```

##### Sanity studio

```bash
  cd sanity
  npm run dev
```

<!-- Contributing -->

### :wave: Contributing

<a href="https://github.com/Louis3797/awesome-readme-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Louis3797/awesome-readme-template" />
</a>

#### Contributions are always welcome!

<!-- Contact -->

### Author

- [@Zwel](https://www.linkedin.com/in/zwelhtetyan/)

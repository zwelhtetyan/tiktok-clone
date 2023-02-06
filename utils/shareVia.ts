export function shareVia(via: string, postURL: string, postTitle: string) {
  let url = '';
  switch (via) {
    case 'facebook':
      url = `https://www.facebook.com/sharer.php?u=${postURL}`;
      break;
    case 'pinterest':
      url = `https://pinterest.com/pin/create/bookmarklet/?url=${postURL}&is_video=true&description=${postTitle}`;
      break;
    case 'twitter':
      url = `https://twitter.com/share?url=${postURL}&text=${postTitle}`;
      break;
    case 'reddit':
      url = `https://reddit.com/submit?url=${postURL}&title=${postTitle}`;
      break;
    default:
      url = postURL;
      return;
  }

  return url;
}

export async function nativeShareVia(caption: string, postURL: string) {
  try {
    await navigator.share({ title: 'TikTok', text: caption, url: postURL });
  } catch (err) {
    console.log(err);
  }
}

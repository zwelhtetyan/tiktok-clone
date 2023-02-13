export function generateFakeUsername(userName: string) {
  return userName?.replaceAll(' ', '').toLocaleLowerCase();
}

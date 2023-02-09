import { CiPizza } from 'react-icons/ci';
import { BsCodeSlash } from 'react-icons/bs';
import { FaRegLaughSquint } from 'react-icons/fa';
import { IoGameControllerOutline } from 'react-icons/io5';
import { GiBearFace, GiSoundOn } from 'react-icons/gi';
import { BiFootball } from 'react-icons/bi';
import { CgGirl } from 'react-icons/cg';

export const topics = [
  {
    name: 'beauty',
    icon: <CgGirl size={20} />,
  },
  {
    name: 'dance',
    icon: <GiSoundOn size={20} />,
  },
  {
    name: 'food',
    icon: <CiPizza size={20} />,
  },
  {
    name: 'gaming',
    icon: <IoGameControllerOutline size={20} />,
  },
  {
    name: 'animals',
    icon: <GiBearFace size={20} />,
  },
  {
    name: 'sports',
    icon: <BiFootball size={20} />,
  },
  {
    name: 'development',
    icon: <BsCodeSlash size={20} />,
  },
  {
    name: 'comedy',
    icon: <FaRegLaughSquint size={20} />,
  },
];

export const socialIcons = [
  { icon: '/facebook.png', name: 'facebook' },
  { icon: '/pinterest.png', name: 'pinterest' },
  { icon: '/twitter.png', name: 'twitter' },
  { icon: '/reddit.png', name: 'reddit' },
];

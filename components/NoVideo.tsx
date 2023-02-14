import Image from 'next/image';

interface Props {
  title: string;
  desc?: string;
}

export default function NoVideo({ title, desc }: Props) {
  return (
    <div className='mt-16 flex flex-col items-center'>
      <Image
        src='/404.svg'
        width={300}
        height={300}
        alt='notfound'
        className='w-52'
      />

      <h4 className='mt-5 font-extrabold text-2xl'>{title}</h4>
      <p className='mt-2 text-gray-700 dark:text-gray-300'>{desc}</p>
    </div>
  );
}

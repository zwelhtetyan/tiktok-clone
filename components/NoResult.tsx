import Image from 'next/image';

interface Props {
  title?: string;
  desc?: string;
}

export default function NoResult({ title, desc }: Props) {
  return (
    <div className='mt-16 flex flex-col items-center'>
      <Image
        src='/404.svg'
        width={300}
        height={300}
        alt='notfound'
        priority
        className='w-52'
      />

      <h4 className='mt-5 text-center text-xl font-extrabold sm:text-2xl'>
        {title}
      </h4>

      <p className='text-center text-gray-700 dark:text-gray-300'>{desc}</p>
    </div>
  );
}

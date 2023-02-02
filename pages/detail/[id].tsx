import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Detail() {
  return (
    <>
      <Head>
        <title>video name | Tik Tok</title>
      </Head>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const videoId: string = context.params.id;

  // const {data} = axios.get(`${process.env.NEXT_PUBLIC_ROOT_URL}/`)

  return { props: {} };
}

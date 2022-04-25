import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../Components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}
const Home = ({ posts }: Props) => {
  console.log(posts)
  return (
    <div className="md:mx-auto  md:max-w-7xl">
      <Header />
      <div className="flex items-center justify-between border-2 border-y-black bg-yellow-500 py-10 lg:py-0">
        <div className="space-y-5 p-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>
            {'\t'}is a place to write, read, and connect.
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <img
          className=" hidden h-24 md:inline-flex lg:h-48"
          src="https://links.papareact.com/yvf"
          alt="medium-logo"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {posts?.map((post) => {
          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group cursor-pointer overflow-hidden rounded-lg border">
                <img
                  className=" h-60 w-full rounded-2xl object-cover px-1 transition-transform duration-200 ease-in-out group-hover:scale-105"
                  src={urlFor(post.mainImage).url()!}
                  alt="post-image"
                ></img>
                <div className="flex-d m-2 flex justify-between bg-white">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt="author-img"
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type =="post"]{
    _id,
    title,
    author -> {
    name,
    image
  },
   description,
  mainImage,
  slug
  }`
  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
export default Home

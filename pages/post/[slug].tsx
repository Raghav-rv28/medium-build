import { GetStaticProps } from 'next'
import Header from '../../Components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
interface Props {
  post: Post
}
function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }
  console.log(post)
  return (
    <main>
      <Header />

      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="main-image"
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-14 w-14 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="autho-image"
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span>
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post!.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ href, children }: any) => (
                <a href={href} className="tesxt-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-green-500" />
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col rounded-lg bg-green-500 p-10 text-white">
          <h3 className="text-2xl font-bold">
            Thank you for submitting the Comment!
          </h3>
          <p>Once it has been approved it will be visible below the article</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-green-500">Enjoyed the article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="my-5" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-700 focus:ring"
              placeholder="Alex Lewis"
              type="text"
            ></input>
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-700 focus:ring"
              placeholder="Email..."
              type="text"
            ></input>
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-700 focus:ring"
              placeholder="Enter your Comment...."
              rows={6}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The Name field is Required</span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email field is Required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment field is Required
              </span>
            )}
          </div>
          <input
            type="submit"
            placeholder="Submit Comment"
            className="focus:shadow-outline cursor-pointer rounded-md bg-green-500 py-2 px-4 font-bold text-white shadow hover:bg-green-200 focus:outline-none"
          />
        </form>
      )}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-green-500">
        <h3 className="text-4xl">Comments</h3>
        <hr />
        {post.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <p>
                <span className="mx-2 text-green-500">{comment.name}</span>:
                {`\t`}
                {comment.comment}
              </p>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type =="post"]{
    _id,
    slug{
      current
    }
  }`
  const posts = await sanityClient.fetch(query)

  const paths = posts?.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type =="post" && slug.current == $slug][0]{
    _id,
    title,
    author -> {
    name,
    image
  },
  'comments': *[
    _type == 'comment' && 
    post._ref == ^._id && 
    approved == true],
   description,
  mainImage,
  slug,
  body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
  }
}

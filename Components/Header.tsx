import Link from 'next/link'
function header() {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center">
        <Link href="/">
          <img
            className="h-16 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt="medium-logo"
          />
        </Link>
        <div className="ml-5 hidden items-center space-x-10 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-10 text-green-600">
        <h4>Sign In</h4>
        <h4 className="rounded-full border border-green-600 px-4 py-1">
          Get Started
        </h4>
      </div>
    </header>
  )
}

export default header

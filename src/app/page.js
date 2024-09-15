import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-9xl mb-8">毛</h1>

        <Link href="/stage1" className="text-2xl text-blue-500 hover:underline">
          Let&apos;s Play
        </Link>
      </div>
    </div>
  )
}
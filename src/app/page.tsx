import prisma from "@/lib/db"

const page = async () => {
  const users = await prisma.user.findMany()


  return (
    <div className="font-bold text-rose-500">
      Hello World
    </div>
  )
}


export default page


import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className='flex flex-col space-y-3'>
      <Skeleton className='min-h-[630px] h-full w-full mt-5 bg-zinc-500 ' />
    </div>
  )
}

export default Loading
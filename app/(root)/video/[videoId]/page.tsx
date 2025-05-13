import VideoDetailHeader from "@/components/VideoDetailHeader";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideoById } from "@/lib/actions/video"
import { redirect } from "next/navigation";

const page = async ({ params }: Params) => {
  const { videoId } = await params;

  const { user, video } = await getVideoById(videoId);

  if (!video) return redirect('/404');



  return (
    <main className='wrapper page'>
      <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId} />

      <section className="video-details">
        <div className="content">
          <VideoPlayer videoId={video.videoId} />
        </div>
      </section>
    </main>
  )
}

export default page

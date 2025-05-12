import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";

const page = async ({ params }: ParamsWithSearch) => {
  const { id } = await params;
  console.log(id);

  return (
    <div className="wrapper page">
      <Header subHeader="sabamshvildadze05@gmail.com" title="Smiley | NextJS Mastery" userImg="/assets/images/dummy.jpg" />

      <section className="video-grid">
        {dummyCards.map((card) => (
          <VideoCard key={card.id} {...card} />
        ))}
      </section>
    </div>
  )
}

export default page

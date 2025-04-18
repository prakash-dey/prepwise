import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import axios from "axios";
import { isUserAuthenticated } from "@/lib/auth";


async function getAllInterviewsByUserId(userId: string) {
  return await axios
    .get(`${process.env.DOMAIN_NAME}/api/interview/user/${userId}`)
    .then((response) => {
      if (response.data.success === false) {
        return [];
      }
      return response.data.data;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

async function Home() {

  const user  = await isUserAuthenticated();
    if (!user) {
      return (
        <h3>User is not authenticated</h3>
      )
    }
    const userId = user?._id as string;

    const userInterviews = await getAllInterviewsByUserId(userId);

    const upcomingInterviews = userInterviews.filter(
      (interview: InterviewCardProps) => interview.pending === true
    );
    const allInterview = userInterviews.filter(
      (interview: InterviewCardProps) => interview.pending === false
    );
 
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Upcoming Interviews</h2>

        <div className="interviews-section">
          {upcomingInterviews.length > 0 ? (
            upcomingInterviews?.map((interview: InterviewCardProps) => (
              <InterviewCard
                key={interview._id}
                userId={interview.userId}
                interviewId={interview?._id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {allInterview.length > 0 ? (
            allInterview?.map((interview: InterviewCardProps) => (
              <InterviewCard
                key={interview._id}
                userId={interview.userId}
                interviewId={interview?._id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;

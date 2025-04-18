import Agent from "@/components/Agent";
import { isUserAuthenticated } from "@/lib/auth";

const Page = async () => {
  const user = await isUserAuthenticated();
  if (!user) {
    return <h3>User is not authenticated</h3>;
  }
  const {name,_id} = user;
  console.log("user",user);
  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={name}
        userId={_id?.toString()}
        // profileImage={user?.profileURL as string}
        type="generate"
      />
    </>
  );
};

export default Page;
import Head from "next/head";
import Chat from "../components/Chat";

const Home = () => {
  return (
    <>
      <Head>
        <title>Real-Time Chat with Translation</title>
        <meta name="description" content="Chat application with real-time translation" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <h1>Real-Time Chat with Translation</h1>
        <Chat />
      </main>
    </>
  );
};

export default Home;

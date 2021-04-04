import Head from "next/head";
import Link from "next/link";
import Layout from "components/layout";

export default function Index() {
  return (
    <Layout home="false">
      <Head>
        <title>Layout formatter</title>
      </Head>
      <h1>Formatter</h1>
      <h2>
        <Link href="/">
          <a>Back home</a>
        </Link>
      </h2>
    </Layout>
  );
}

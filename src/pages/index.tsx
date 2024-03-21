import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "components/layout";
import utilStyles from "styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          <Link href="/qmk-layout-format/Sofle">QMK Layout format</Link>
        </p>
        <p>
          <Link href="/zmk-layout-format/Reviung41">ZMK Layout format</Link>
        </p>
      </section>
    </Layout>
  );
}

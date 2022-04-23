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
          <Link href="/layout-format/Sofle">
            <a>QMK Layout format</a>
          </Link>
        </p>
        <p>
          <Link href="/zmk-layout-format/reviung">
            <a>ZMK Layout format</a>
          </Link>
        </p>
      </section>
    </Layout>
  );
}

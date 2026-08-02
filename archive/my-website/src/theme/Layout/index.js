import React from "react";

import Layout from "@theme-original/Layout";

import { ProFeedWidget } from "@site/src/components/ProFeedWidget";

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <ProFeedWidget />
    </>
  );
}


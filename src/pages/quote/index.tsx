import Header from "@/components/header";
import Quote from "@/components/quote";
import QuoteFilter from "@/components/quote-filter";
import { useAppStore } from "@/stores/app";
import { usePropertyStore } from "@/stores/property";
import { useUsageStore } from "@/stores/usage";
import { inferMutationOutput, trpc } from "@/utils/trpc";
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { NextPageWithLayout } from "../_app";
import { useFilterStore } from "@/stores/filter";
import Modal from "@/components/modal";
import { useModal } from "mui-modal-provider";

type Response = inferMutationOutput<"quote.public.create">;

const QuotePage: NextPageWithLayout = () => {
  const { load, unload } = useAppStore();
  const { ref, inView } = useInView();
  const { showModal } = useModal();
  const { filter } = useFilterStore();
  const { propertyType, monthlyUsage } = useUsageStore();
  const { id: address } = usePropertyStore();
  const [headerHeight, setHeaderHeight] = useState(0);
  const { data, status, fetchNextPage } = trpc.useInfiniteQuery(
    [
      "quote.public.infiniteQuotes",
      {
        limit: 10,
        address,
        bill: {
          propertyType,
          monthlyUsage,
        },
        filters: filter,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onSuccess(data) {
        unload();
      },
      onError: (error) => {
        unload();
        showModal(Modal, { title: "Error", body: error.message });
      },
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  useEffect(() => {
    setHeaderHeight(
      document.querySelector("header")?.getBoundingClientRect().height!
    );
  }, [setHeaderHeight]);
  if (status === "loading") {
    return <></>;
  }

  return (
    <div className="flex" style={{ height: "100vh" }}>
      <QuoteFilter style={{ paddingTop: headerHeight + "px" }} />
      <div
        className="overflow-y-auto h-full w-full p-6 md:p-12"
        style={{ paddingTop: headerHeight + 20 + "px" }}
      >
        <div className="mx-auto flex flex-col gap-8">
          {data!.pages.map((page) => {
            return page.quotes.map((quote) => (
              <Quote key={quote.id} {...quote} />
            ));
          })}
        </div>
        <div ref={ref}></div>
      </div>
    </div>
  );
};

QuotePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <style></style>
      </Head>
      <Header />
      {page}
    </>
  );
};

export default QuotePage;

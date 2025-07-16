import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

const page = () => {
  const QueryClient = getQueryClient();
  void QueryClient.prefetchQuery(trpc.createAI.queryOptions({ text: "Hello Antonio" }))

  return (
    <HydrationBoundary state={dehydrate(QueryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  )
}

export default page

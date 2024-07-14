"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function AgreementDocument() {
  const {
    data: document,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["document"],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.example.com/api/register/document",
      );
      return res.data.data.document;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred : {error.message}</div>;
  return <div>{document}</div>;
}

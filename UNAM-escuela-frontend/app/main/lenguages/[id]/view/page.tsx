"use client";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function ContentLenguage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  
  return <div>Prueba</div>;
}

export default ContentLenguage;

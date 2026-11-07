"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { isPhone } from "@/lib/motion";

/**
 * next/link that doesn't prefetch on phones: a visible link would pull its whole route's JS and
 * data into the first load. Desktop keeps Next's default.
 */
export default function SiteLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={isPhone() ? false : props.prefetch} />;
}
